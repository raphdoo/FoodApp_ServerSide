//declaring the dependency variables

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//connecting to the routes module
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promotionRouter = require('./routes/promotionRouter');

//connecting to a database
const mongoose = require("mongoose")
const dishes = require("./model/dishSchema")

mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/conFusion"; //mongodb local server
const connect = mongoose.connect(url, {useMongoClient : true}); //connecting to mongodb localhost server

connect.then((db)=>{
  console.log("connected successfully to server")

}, (err) => { next(err) })

//using express framework
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//declaring middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //serving static files

//declaring the routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

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

module.exports = app;
