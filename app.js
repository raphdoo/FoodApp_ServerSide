//declaring the dependency variables

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session")
var passport = require('passport')


//connecting to the routes module
var config = require('./config')
var authenticate = require('./authenticate')
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var leaderRouter = require("./routes/leaderRouter");
var promotionRouter = require("./routes/promotionRouter");
const uploadRouter = require('./routes/uploadRouter')
const favouriteRoute = require('./routes/favouriteRoute')

//connecting to a database
const mongoose = require("mongoose");
const dishes = require("./model/dishSchema");

mongoose.set("useCreateIndex", true);

const url = config.mongoUrl; //mongodb local server
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //connecting to mongodb localhost server

connect.then(
  (db) => {
    console.log("connected successfully to server");
  },
  (err) => {
    next(err);
  }
);

//using express framework
var app = express();

//handling re-routing to a secure server
app.all('*', (req, res, next)=>{
  if(req.secure){
    return next()
  }
  else{
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url)
  }
})

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//declaring middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  name: "session-id",
  secret: "1234-4321",
  saveUninitialized: false,
  resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, "public"))); //serving static files

//declaring the routes after authentication

app.use('/imageupload', uploadRouter)
app.use("/dishes", dishRouter);
app.use('/favourites', favouriteRoute)
app.use("/promotions", promotionRouter);
app.use("/leaders", leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
