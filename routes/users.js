var express = require('express');
var router = express.Router();
var passport = require("passport")
const bodyParser = require("body-parser")
var User = require("../model/users")

var authenticate = require('../authenticate');
const cors = require('./cors')

router.use(bodyParser.json())

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then((users)=>{
    if(users == null){
      var err = new Error('No user found')
      err.status = 404
      return next(err)
    }
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.send(users)
  }, (err)=>{ next(err) })
  .catch((err)=>{
    next(err)
  })
});

router.post("/signup", cors.corsWithOptions, (req, res, next)=>{
  User.register( new User({username:req.body.username}), req.body.password, (err, user)=>{
    if(err){
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({err: err})
    }
    else{
      if(req.body.firstname){
        user.firstname = req.body.firstname
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname
      }
      user.save((err,user)=>{
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req,res, ()=>{
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({success: true, status:'registration successful'})
        })
      })
    }
  })
});

router.post("/login", cors.corsWithOptions, passport.authenticate("local"),(req, res)=>{
  var token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({success: true, token: token, status:'You are successfully logged in'})
})

router.get("/logout",cors.corsWithOptions, (req, res, next) =>{
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
