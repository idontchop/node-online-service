import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import bodyParser from 'body-parser'

import indexRouter from './routes/index.js'

import listener from './listener/listener.js'

import OnlineStore from './models/OnlineStore.mjs'


console.log("Starting node-online-service by github.com/idontchop")
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*********
 * END EXPRESS
 *********/


// Register mongoDb storage with kafka listener
listener.registerOnlineCallBack('app', e => OnlineStore.update(e))

// Ok run it!

export default app
