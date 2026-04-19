require('dotenv').config();
const http = require('http');
const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes');
const socketEvents = require('./socket-events');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

app.set('views', 'views');
app.use(express.static('./public'));
app.set('view engine', 'html');
app.engine('html', consolidate.handlebars);

const db = process.env.MONGO_URI || 'mongodb://localhost:27017/rpngc';
const isProduction = process.env.NODE_ENV === 'production';

mongoose.connect(db)
    .then(() => console.log(`Connected to MongoDB: rpngc (${process.env.NODE_ENV || 'development'})`))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.use('/', routes);

const server = http.Server(app);
const PORT = process.env.PORT || 8000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`RPNGC Dispatch running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    socketEvents.initialize(server);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server gracefully...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});
