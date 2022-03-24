var createError = require('http-errors');
const httpStatus = require('http-status');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
const { jwtStrategy } = require('./src/config/passport');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');

const oneDay = 1000 * 60 * 60 * 24;

var indexRouter = require('./routes/index');
const routes = require('./routes/v1');


var app = express();

const ApiError = require('./src/utils/ApiError');
const { errorConverter, errorHandler } = require('./src/middlewares/error');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

//parse json request
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//set security HTTP heades
app.use(helmet());

//sanitize request
app.use(xss());
app.use(mongoSanitize());

//gzip compression
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

// jwt authentication
app.use(session({ secret: 'SECRET',saveUninitialized:true,
cookie: { maxAge: oneDay },
resave: false  }));
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
app.use(passport.session());

app.use('/', indexRouter);
app.use('/v1', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Page Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
