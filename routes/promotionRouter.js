const express = require("express");
const bodyParser = require('body-parser');

const mongoose = require("mongoose")
const promotions = require("../model/promotionSchema")

promotionRouter = express.Router();

promotionRouter.use(bodyParser.json())

promotionRouter.route("/")
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    next()
})
.get((req, res, next) => {
    promotions.find({})
    .then((promotions) =>{
        res.statusCode = 200
        res.send(promotions)
        
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.post((req, res, next) => {
    promotions.create(req.body)
    .then((promotion)=>{
        res.statusCode = 200
        res.send(promotion)
    }, (err) =>{ next(err) })
    .catch((err) =>{ next(err) })
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.end(`This method is not allowed here`)
})
.delete((req, res, next) =>{
    promotions.remove()
    .then((resp) =>{

        res.status = 200
        res.setHeader("Content-Type", "application/json")
        res.send(resp)
    }, (err) => { next(err) })
    .catch((err)=>{
        next(err)
    })
});

promotionRouter.route("/:promoID")
.get((req, res, next) => {
    promotions.findById(req.params.promoID)
    .then((promotion=>{
        if(promotion != null){

            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.send(promotion)
        }else{
            res.statusCode = 404
            res.send(`Promotion with id ${req.params.promoID} not found`)
        }
    }), (err)=>{ next(err) })
    .catch((err) => { next(err) })
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`This method is not supported` )
})
.put((req, res, next) => {
    promotions.findByIdAndUpdate(req.params.promoID, {
        $set: req.body
    }, { new: true})
    .then((promo)=>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(promo)
    }, (err) =>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.delete((req, res, next) => {
    promotions.findByIdAndRemove(req.params.promoID)
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(resp)
    }, (err)=>{ next(err) })
    .catch((err)=>{ next(err) })
});



module.exports = promotionRouter
