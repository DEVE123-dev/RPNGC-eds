const { Officer, Incident, Admin } = require('./data-model');

function fetchNearestOfficers(coordinates, maxDistance) {
    return Officer.find({
        status: 'available',
        active: true,
        location: {
            $near: {
                $geometry: { type: 'Point', coordinates },
                $maxDistance: maxDistance
            }
        }
    }).exec().catch(err => console.error(err));
}

function fetchOfficerDetails(userId) {
    return Officer.findOne({ userId }).exec().catch(err => console.error(err));
}

function fetchOfficerByBadge(badgeNumber) {
    return Officer.findOne({ badgeNumber }).exec().catch(err => console.error(err));
}

function fetchAllOfficers() {
    return Officer.find({}, { passwordHash: 0 }).exec().catch(err => console.error(err));
}

function updateOfficerLocation(userId, coordinates, address) {
    return Officer.findOneAndUpdate(
        { userId },
        { 'location.coordinates': coordinates, 'location.address': address },
        { new: true }
    ).exec().catch(err => console.error(err));
}

function updateOfficerStatus(userId, status) {
    return Officer.findOneAndUpdate({ userId }, { status }, { new: true })
        .exec().catch(err => console.error(err));
}

function upsertOfficer(data) {
    return Officer.findOneAndUpdate(
        { userId: data.userId },
        data,
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec().catch(err => console.error(err));
}

function deactivateOfficer(userId) {
    return Officer.findOneAndUpdate({ userId }, { active: false, status: 'offline' }, { new: true })
        .exec().catch(err => console.error(err));
}

function saveIncident(id, requestTime, location, citizenId, citizenPhone, incidentType, urgency, isSOS) {
    const incident = new Incident({
        _id: id,
        requestTime,
        location,
        citizenId,
        citizenPhone: citizenPhone || '',
        incidentType,
        urgency,
        isSOS: isSOS || false,
        status: 'waiting'
    });
    return incident.save().catch(err => console.error(err));
}

function updateIncident(incidentId, officerId, status, resolutionNotes) {
    const update = { status, officerId };
    if (resolutionNotes) update.resolutionNotes = resolutionNotes;
    if (status === 'resolved') update.resolvedTime = new Date();
    return Incident.findOneAndUpdate({ _id: incidentId }, update, { new: true })
        .exec().catch(err => console.error(err));
}

function addMessageToIncident(incidentId, senderId, senderRole, text) {
    return Incident.findOneAndUpdate(
        { _id: incidentId },
        { $push: { messages: { senderId, senderRole, text, timestamp: new Date() } } },
        { new: true }
    ).exec().catch(err => console.error(err));
}

function fetchIncidents(filter = {}) {
    return Incident.find(filter).sort({ requestTime: -1 }).exec().catch(err => console.error(err));
}

function fetchIncidentById(id) {
    return Incident.findById(id).exec().catch(err => console.error(err));
}

function fetchAdminByUsername(username) {
    return Admin.findOne({ username }).exec().catch(err => console.error(err));
}

module.exports = {
    fetchNearestOfficers,
    fetchOfficerDetails,
    fetchOfficerByBadge,
    fetchAllOfficers,
    updateOfficerLocation,
    updateOfficerStatus,
    upsertOfficer,
    deactivateOfficer,
    saveIncident,
    updateIncident,
    addMessageToIncident,
    fetchIncidents,
    fetchIncidentById,
    fetchAdminByUsername
};
