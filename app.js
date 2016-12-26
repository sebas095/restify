const restify = require('restify');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('morgan');
const authMiddleware = require('./middleware/auth');
require('colors');

let app = {};

const env = process.env.NODE_ENV || 'development';
app.config = require('./config/' + env);

app.server = restify.createServer({
  name: 'simple-api-rest',
  version: '1.0.0'
});

app.server.use(logger('dev'));
app.server.use(restify.acceptParser(app.server.acceptable));
app.server.use(restify.queryParser());
app.server.use(restify.bodyParser());
app.server.use(cors({
  origin: true,
  credentials: true
}));

// Routes
const index = require('./routes');
const movie = require('./routes/movie');
const user = require('./routes/user');
const auth = require('./routes/auth');

mongoose.Promise = global.Promise;
mongoose.connect(app.config.db.url);
app.db = mongoose.connection;

app.db.on('open', () => {
  console.log('connected to db'.yellow);
});

index(app, '/');
user(app, '/user');
auth(app, '/auth');

// route authentication
app.server.use(authMiddleware);
movie(app, '/movie');

module.exports = app;
