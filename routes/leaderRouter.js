const express = require("express");
const bodyParser = require('body-parser');

const mongoose = require("mongoose")
const leaders = require("../model/leaderSchema")
const authenticate = require('../authenticate')

leadersRouter = express.Router();

leadersRouter.use(bodyParser.json())

leadersRouter.route("/")
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    next()
})
.get((req, res, next) => {
    leaders.find({})
    .then((leaders) =>{
        res.statusCode = 200
        res.send(leaders)
        
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.create(req.body)
    .then((leader)=>{
        res.statusCode = 200
        res.send(leader)
    }, (err) =>{ next(err) })
    .catch((err) =>{ next(err) })
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403;
    res.end(`This method is not allowed here`)
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    leaders.remove()
    .then((resp) =>{

        res.status = 200
        res.setHeader("Content-Type", "application/json")
        res.send(resp)
    }, (err) => { next(err) })
    .catch((err)=>{
        next(err)
    })
});


leadersRouter.route("/:leaderID")
.get((req, res, next) => {
    leaders.findById(req.params.leaderID)
    .then((leader=>{
        if(leader != null){

            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.send(leader)
        }else{
            res.statusCode = 404
            res.send(`leader with id ${req.params.leaderID} not found`)
        }
    }), (err)=>{ next(err) })
    .catch((err) => { next(err) })
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`This method is not supported` )
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.findByIdAndUpdate(req.params.leaderID, {
        $set: req.body
    }, { new: true})
    .then((leader)=>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(leader)
    }, (err) =>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.findByIdAndRemove(req.params.leaderID)
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(resp)
    }, (err)=>{ next(err) })
    .catch((err)=>{ next(err) })
});



module.exports = leadersRouter
