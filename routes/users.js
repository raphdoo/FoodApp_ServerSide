var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser")
var users = require("../model/users")

router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", (req, res, next)=>{
  users.findOne({username:req.body.username})
  .then((user)=>{
    if(user != null){
      var err = new Error(`User ${req.body.username} already exist`);
      err.status = 403
      next(err)
    }
    else{
      return users.create({username:req.body.username, password: req.body.password})
    }
  })
  .then((user)=>{
    res.status = 200;
    res.setHeader("Content-Type", "application/json")
    res.json({ status:"Registration successful", user: user })
  }, (err) => { next(err) })
  .catch((err)=>{ next(err)})

});

router.post("/login", (req, res, next)=>{
  if(!req.session.user){
    var authHeader = req.headers.authorization

    if(!authHeader){
      var err = new Error("User not authenticated");
      res.setHeader("WWW-Authenticate", "Basic")
      err.status = 401;
      return next(err)
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    users.findOne({username: username})
    .then((user)=>{
      if(user == null){
        var err = new Error(`User ${username} does not exist`);
        err.status = 403;
        return next(err);
      }
      else if(user.password != password){
        var err = new Error(`Password ${password} is incorrect`);
        err.status = 403;
        return next(err);
      }
      else if(user.username == username && user.password == password){
        req.session.user = 'authenticated'
        res.status = 200;
        res.setHeader("Content-Type", "application/json")
        res.end("You are authenticated")
      }
    })
    .catch((err)=>{
      next(err)
    })
  }
  else{
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json")
    res.end("You are already authenticated")
  }
})

router.get("/logout", (req, res, next) =>{
  if(req.session){
    req.session.destroy()
    res.clearCookie("session-id")
    res.redirect('/')
  }
  else{
    var err = new Error("You are not logged in")
    err.status = 403;
    return next(err)
  }
})

module.exports = router;
