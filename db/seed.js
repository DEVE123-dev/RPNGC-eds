/**
 * Seed script — run once to populate officers and HQ admin.
 * Usage: node db/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
// seed file unchanged
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Officer, Admin } = require('./data-model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rpngc';

const officers = [
    {
        userId: 'officer-01', badgeNumber: 'RPNGC-001', rank: 'Senior Constable',
        displayName: 'Ben Deveh', station: 'Boroko Police Station',
        phone: '+675 7683 1365', email: 'benjaminbino19@gmail.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        location: { type: 'Point', address: 'Boroko, NCD, PNG', coordinates: [147.1803, -9.4438] }
    },
    {
        userId: 'officer-02', badgeNumber: 'RPNGC-002', rank: 'Constable',
        displayName: 'Mary Temu', station: 'Gordons Police Station',
        phone: '+675 7100 0002', email: 'mtemu@rpngc.gov.pg',
        passwordHash: bcrypt.hashSync('password123', 10),
        location: { type: 'Point', address: 'Gordons, NCD, PNG', coordinates: [147.1950, -9.4200] }
    },
    {
        userId: 'officer-03', badgeNumber: 'RPNGC-003', rank: 'Sergeant',
        displayName: 'Peter Naime', station: 'Waigani Police Station',
        phone: '+675 7100 0003', email: 'pnaime@rpngc.gov.pg',
        passwordHash: bcrypt.hashSync('password123', 10),
        location: { type: 'Point', address: 'Waigani, NCD, PNG', coordinates: [147.1900, -9.4100] }
    }
];

async function seed() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, tls: true });
    console.log('Connected to MongoDB');
    await Officer.deleteMany({});
    await Admin.deleteMany({});

    await Officer.insertMany(officers);
    console.log(`Seeded ${officers.length} officers`);

    await Admin.create({
        username: 'hq-admin',
        passwordHash: bcrypt.hashSync('hqpassword123', 10),
        displayName: 'HQ Command'
    });
    console.log('Seeded HQ admin (username: hq-admin, password: hqpassword123)');

    await mongoose.disconnect();
    console.log('Done.');
}

seed().catch(err => { console.error(err); process.exit(1); });
