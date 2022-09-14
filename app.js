//declaring the dependency variables

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session")
var FileStore = require("session-file-store")(session)

//connecting to the routes module
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var leaderRouter = require("./routes/leaderRouter");
var promotionRouter = require("./routes/promotionRouter");

//connecting to a database
const mongoose = require("mongoose");
const dishes = require("./model/dishSchema");

mongoose.set("useCreateIndex", true);

const url = "mongodb://localhost:27017/conFusion"; //mongodb local server
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
  store: new FileStore()
}));

const authenticate = (req, res, next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      next(err);
      return;
    }

    var auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    var user = auth[0];
    var pass = auth[1];
    if (user == "admin" && pass == "password") {
      req.session.user = 'admin'
      next(); // authorized
    } else {
      var err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      next(err);
    }
  }else{
    if(req.session.user == 'admin'){
      next()
    }else{
      var err = new Error("You are not authenticated!");
      err.status = 401;
      next(err);
    }
  } 
};

app.use(authenticate);

app.use(express.static(path.join(__dirname, "public"))); //serving static files

//declaring the routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);
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
