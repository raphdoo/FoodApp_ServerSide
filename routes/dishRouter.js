const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const dishes = require("../model/dishSchema")

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route("/")
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    next()
})
.get((req, res, next) => {
    dishes.find({})
    .then((dishes)=>{

        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(dishes)
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.post((req, res, next) => {
    dishes.create(req.body)
    .then(dish =>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(dish)
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.end(`This method is not allowed here`)
})
.delete((req, res, next) =>{
    dishes.delete({})
    .then((resp)=>{

        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(resp)
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
});


dishRouter.route("/:dishID")
.get((req, res, next) => {
    dishes.findById(req.params.dishID)
    .then((dish)=>{
        
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(dish)
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`This method is not supported` )
})
.put((req, res, next) => {
    dishes.findByIdAndUpdate(req.params.dishID, {
        $set: req.body
    },{ new:true})
    .then((dish) => {
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(dish)
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.delete((req, res, next) => {
    dishes.findByIdAndRemove(req.params.dishID)
    .then((resp) =>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(resp)
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
});





module.exports = dishRouter;