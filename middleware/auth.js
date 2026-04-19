const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rpngc-secret-key';

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

function verifyToken(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ error: 'No token provided' });
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
}

module.exports = { signToken, verifyToken, requireRole };
