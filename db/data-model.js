const mongoose = require('mongoose');

const officerSchema = mongoose.Schema({
    userId: { type: String, unique: true, required: true, trim: true },
    displayName: { type: String, trim: true },
    badgeNumber: { type: String, unique: true, required: true },
    rank: { type: String, default: 'Constable' },
    station: { type: String },
    phone: { type: String },
    email: { type: String, unique: true },
    passwordHash: { type: String },
    earnedRatings: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    status: { type: String, default: 'available' }, // available | busy | break | offline
    active: { type: Boolean, default: true },
    location: {
        type: { type: String, required: true, default: 'Point' },
        address: { type: String },
        coordinates: [Number]
    }
});

officerSchema.index({ location: '2dsphere', userId: 1 });
const Officer = mongoose.model('Officer', officerSchema);

const incidentSchema = mongoose.Schema({
    requestTime: { type: Date },
    resolvedTime: { type: Date },
    location: {
        coordinates: [Number],
        address: { type: String }
    },
    citizenId: { type: String },
    citizenPhone: { type: String },
    officerId: { type: String },
    incidentType: { type: String, default: 'General' },
    urgency: { type: String, default: 'medium' },
    status: { type: String, default: 'waiting' }, // waiting | engaged | resolved
    resolutionNotes: { type: String },
    isSOS: { type: Boolean, default: false },
    // message thread
    messages: [{
        senderId: { type: String },
        senderRole: { type: String }, // citizen | officer
        text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
});

const Incident = mongoose.model('Incident', incidentSchema);

const adminSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String }
});

const Admin = mongoose.model('Admin', adminSchema);

exports.Officer = Officer;
exports.Incident = Incident;
exports.Admin = Admin;
