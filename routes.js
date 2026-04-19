require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('./db/db-operations');
const { Officer } = require('./db/data-model');
const { signToken, verifyToken, requireRole } = require('./middleware/auth');

// --- Pages ---
router.get('/', (req, res) => res.render('index.html'));
router.get('/citizen.html', (req, res) => res.render('citizen.html', { userId: req.query.userId }));
router.get('/officer.html', (req, res) => res.render('officer.html', { userId: req.query.userId }));
router.get('/hq.html', (req, res) => res.render('hq.html'));
router.get('/admin.html', (req, res) => res.render('admin.html'));

// --- Auth ---
router.post('/auth/officer/login', async (req, res) => {
    try {
        const { badgeNumber, password } = req.body;
        const officer = await db.fetchOfficerByBadge(badgeNumber);
        if (!officer || !officer.active) return res.status(401).json({ error: 'Invalid badge number or password' });
        const valid = await bcrypt.compare(password, officer.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid badge number or password' });
        const token = signToken({ userId: officer.userId, role: 'officer', badgeNumber });
        res.json({ token, userId: officer.userId, displayName: officer.displayName });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/auth/hq/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await db.fetchAdminByUsername(username);
        if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        const token = signToken({ username: admin.username, role: 'hq' });
        res.json({ token, displayName: admin.displayName });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Officers ---
router.get('/officers/nearby', async (req, res) => {
    const officers = await db.fetchNearestOfficers([Number(req.query.lng), Number(req.query.lat)], 5000);
    res.json({ officers });
});

router.get('/officers/info', async (req, res) => {
    const officer = await db.fetchOfficerDetails(req.query.userId);
    res.json({ officerDetails: officer });
});

router.get('/officers/all', verifyToken, requireRole('hq'), async (req, res) => {
    const officers = await db.fetchAllOfficers();
    res.json({ officers });
});

// Officer status toggle (officer sets own status)
router.post('/officers/status', verifyToken, requireRole('officer'), async (req, res) => {
    const { status } = req.body;
    const allowed = ['available', 'break', 'offline'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const officer = await db.updateOfficerStatus(req.user.userId, status);
    res.json({ officer });
});

// --- Admin: manage officers ---
router.get('/admin/officers', verifyToken, requireRole('hq'), async (req, res) => {
    const officers = await Officer.find({}).exec();
    res.json({ officers });
});

router.post('/admin/officers', verifyToken, requireRole('hq'), async (req, res) => {
    try {
        const { userId, badgeNumber, displayName, rank, station, phone, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const officer = await db.upsertOfficer({
            userId, badgeNumber, displayName, rank, station, phone, email,
            passwordHash, active: true,
            location: { type: 'Point', address: station || '', coordinates: [147.1803, -9.4438] }
        });
        res.json({ officer });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/admin/officers/:userId', verifyToken, requireRole('hq'), async (req, res) => {
    try {
        const update = { ...req.body };
        if (update.password) {
            update.passwordHash = await bcrypt.hash(update.password, 10);
            delete update.password;
        }
        const officer = await Officer.findOneAndUpdate(
            { userId: req.params.userId }, update, { new: true }
        ).exec();
        res.json({ officer });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/admin/officers/:userId', verifyToken, requireRole('hq'), async (req, res) => {
    await db.deactivateOfficer(req.params.userId);
    res.json({ success: true });
});

// --- Incidents ---
router.get('/incidents/pending', async (req, res) => {
    const incidents = await db.fetchIncidents({ status: 'waiting' });
    res.json({ incidents });
});

router.get('/incidents/stats', verifyToken, requireRole('hq'), async (req, res) => {
    const [waiting, engaged, resolved] = await Promise.all([
        db.fetchIncidents({ status: 'waiting' }),
        db.fetchIncidents({ status: 'engaged' }),
        db.fetchIncidents({ status: 'resolved' })
    ]);
    // avg response time
    const resolvedWithTime = resolved.filter(r => r.resolvedTime && r.requestTime);
    const avgMs = resolvedWithTime.length
        ? resolvedWithTime.reduce((s, r) => s + (r.resolvedTime - r.requestTime), 0) / resolvedWithTime.length
        : 0;
    const avgMinutes = Math.round(avgMs / 60000);
    res.json({
        waiting: waiting.length, engaged: engaged.length,
        resolved: resolved.length, total: waiting.length + engaged.length + resolved.length,
        avgResponseMinutes: avgMinutes
    });
});

router.get('/incidents/report', verifyToken, requireRole('hq'), async (req, res) => {
    const incidents = await db.fetchIncidents({});
    // group by type
    const byType = {};
    const byUrgency = {};
    incidents.forEach(i => {
        byType[i.incidentType] = (byType[i.incidentType] || 0) + 1;
        byUrgency[i.urgency] = (byUrgency[i.urgency] || 0) + 1;
    });
    res.json({ byType, byUrgency, total: incidents.length });
});

router.get('/incidents', verifyToken, requireRole('hq'), async (req, res) => {
    const filter = req.query.status ? { status: req.query.status } : {};
    const results = await db.fetchIncidents(filter);
    const features = results.map(r => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: r.location.coordinates },
        properties: {
            id: r._id, status: r.status, urgency: r.urgency,
            incidentType: r.incidentType, requestTime: r.requestTime,
            address: r.location.address, citizenId: r.citizenId,
            citizenPhone: r.citizenPhone, officerId: r.officerId,
            isSOS: r.isSOS
        }
    }));
    res.json({ type: 'FeatureCollection', features });
});

// Get messages for an incident
router.get('/incidents/:id/messages', verifyToken, async (req, res) => {
    const incident = await db.fetchIncidentById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Not found' });
    res.json({ messages: incident.messages });
});

module.exports = router;
