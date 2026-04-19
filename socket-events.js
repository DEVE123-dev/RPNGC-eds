const mongoose = require('mongoose');
const db = require('./db/db-operations');

function initialize(server) {
    const io = require('socket.io')(server);
    const hqSockets = new Set();

    io.on('connection', (socket) => {

        socket.on('join', (data) => {
            socket.join(data.userId);
            if (data.role === 'hq') hqSockets.add(socket.id);
        });

        socket.on('disconnect', () => {
            hqSockets.delete(socket.id);
        });

        // --- Citizen: request assistance (normal or SOS) ---
        socket.on('request-assistance', async (eventData) => {
            const requestTime = new Date();
            const incidentId = new mongoose.Types.ObjectId();
            const location = {
                coordinates: [eventData.location.lng || eventData.location.longitude, eventData.location.lat || eventData.location.latitude],
                address: eventData.location.address || 'Unknown location'
            };

            await db.saveIncident(
                incidentId, requestTime, location,
                eventData.citizenId || 'anonymous',
                eventData.citizenPhone || '',
                eventData.incidentType || 'General',
                eventData.urgency || 'medium',
                eventData.isSOS || false
            );

            // Prepare incident data for officers
            const incidentData = {
                incidentId: incidentId.toString(),
                citizenId: eventData.citizenId,
                citizenPhone: eventData.citizenPhone,
                incidentType: eventData.incidentType,
                urgency: eventData.urgency,
                description: eventData.description,
                isSOS: eventData.isSOS,
                requestTime: requestTime,
                location: {
                    latitude: location.coordinates[1],
                    longitude: location.coordinates[0]
                }
            };

            // Broadcast to ALL available officers (not just nearby)
            const availableOfficers = await db.fetchAllOfficers();
            if (availableOfficers && availableOfficers.length > 0) {
                for (const officer of availableOfficers) {
                    if (officer.status === 'available' && officer.active) {
                        io.sockets.in(officer.userId).emit('request-assistance', incidentData);
                    }
                }
            }

            broadcastToHQ(io, hqSockets, 'incident-update', {
                type: 'new', incidentId: incidentId.toString(),
                location, citizenId: eventData.citizenId,
                incidentType: eventData.incidentType,
                urgency: eventData.urgency,
                isSOS: eventData.isSOS,
                status: 'waiting'
            });
        });

        // --- Officer: accept incident ---
        socket.on('incident-accepted', async (eventData) => {
            const incidentId = new mongoose.Types.ObjectId(eventData.incidentId);
            await db.updateIncident(incidentId, eventData.officerId, 'engaged');
            await db.updateOfficerStatus(eventData.officerId, 'busy');

            io.sockets.in(eventData.citizenId).emit('incident-accepted', {
                incidentId: eventData.incidentId,
                officerName: eventData.officerDetails.officerName,
                officerBadge: eventData.officerDetails.officerBadge,
                officerLocation: eventData.officerDetails.officerLocation
            });

            broadcastToHQ(io, hqSockets, 'incident-update', {
                type: 'accepted', incidentId: eventData.incidentId,
                officerId: eventData.officerId, status: 'engaged'
            });
        });

        // --- Officer/HQ: close incident ---
        socket.on('incident-closed', async (eventData) => {
            const incidentId = new mongoose.Types.ObjectId(eventData.incidentId);
            await db.updateIncident(incidentId, eventData.officerId, 'resolved', eventData.resolutionNotes);
            if (eventData.officerId) await db.updateOfficerStatus(eventData.officerId, 'available');

            if (eventData.citizenId) {
                io.sockets.in(eventData.citizenId).emit('incident-closed', {
                    resolutionNotes: eventData.resolutionNotes
                });
            }

            broadcastToHQ(io, hqSockets, 'incident-update', {
                type: 'resolved', incidentId: eventData.incidentId,
                status: 'resolved', resolutionNotes: eventData.resolutionNotes
            });
        });

        // --- Officer: live location ---
        socket.on('location-update', async (eventData) => {
            await db.updateOfficerLocation(
                eventData.officerId,
                [eventData.longitude, eventData.latitude],
                eventData.address || ''
            );
            broadcastToHQ(io, hqSockets, 'officer-location', {
                officerId: eventData.officerId,
                displayName: eventData.displayName,
                latitude: eventData.latitude,
                longitude: eventData.longitude
            });
        });

        // --- Officer: availability toggle ---
        socket.on('officer-status', async (eventData) => {
            await db.updateOfficerStatus(eventData.officerId, eventData.status);
            broadcastToHQ(io, hqSockets, 'officer-status-update', {
                officerId: eventData.officerId,
                status: eventData.status
            });
        });

        // --- Messaging within incident ---
        socket.on('send-message', async (eventData) => {
            // eventData: { incidentId, senderId, senderRole, text, recipientId }
            const incident = await db.addMessageToIncident(
                eventData.incidentId,
                eventData.senderId,
                eventData.senderRole,
                eventData.text
            );

            const msg = {
                incidentId: eventData.incidentId,
                senderId: eventData.senderId,
                senderRole: eventData.senderRole,
                text: eventData.text,
                timestamp: new Date()
            };

            // Send to recipient
            io.sockets.in(eventData.recipientId).emit('new-message', msg);
            // Echo back to sender
            socket.emit('new-message', msg);
            // Notify HQ
            broadcastToHQ(io, hqSockets, 'new-message', msg);
        });
    });
}

function broadcastToHQ(io, hqSockets, event, data) {
    for (const socketId of hqSockets) {
        io.to(socketId).emit(event, data);
    }
}

exports.initialize = initialize;
