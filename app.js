const restify = require('restify');
const mongoose = require('mongoose');
const logger = require('morgan');
require('colors');

let app = {};

// const env = process.env.NODE_ENV || 'development';
// const config = require('./config' + env);

app.server = restify.createServer({
  name: 'simple-api-rest',
  version: '1.0.0'
});

app.server.use(logger('dev'));
app.server.use(restify.acceptParser(app.server.acceptable));
app.server.use(restify.queryParser());
app.server.use(restify.bodyParser());

// Routes

mongoose.Promise = global.Promise;
// mongoose.connect(config.db.url);
// app.db = mongoose.connection;
//
// app.db.on('open', () => {
//   console.log('connected to db'.yellow);
// });

module.exports = app;
