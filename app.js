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
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, tls: true })
    .then(() => console.log('Connected to MongoDB: rpngc'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/', routes);

const server = http.Server(app);
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`RPNGC Dispatch running at http://localhost:${PORT}`);
    socketEvents.initialize(server);
});
