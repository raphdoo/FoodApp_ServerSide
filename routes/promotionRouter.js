const express = require("express");
const bodyParser = require('body-parser');

const mongoose = require("mongoose");
const promotions = require("../model/promotionSchema");
const authenticate = require('../authenticate');
const cors = require('./cors')

promotionRouter = express.Router();

promotionRouter.use(bodyParser.json())

promotionRouter.route("/")
.options(cors.corsWithOptions, (req, res)=> { res.sendStatus(200); })
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    next()
})
.get(cors.cors, (req, res, next) => {
    promotions.find({})
    .then((promotions) =>{
        res.statusCode = 200
        res.send(promotions)
        
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.create(req.body)
    .then((promotion)=>{
        res.statusCode = 200
        res.send(promotion)
    }, (err) =>{ next(err) })
    .catch((err) =>{ next(err) })
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403;
    res.end(`This method is not allowed here`)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
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
.options(cors.corsWithOptions, (req, res)=> { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
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
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`This method is not supported` )
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.findByIdAndRemove(req.params.promoID)
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.send(resp)
    }, (err)=>{ next(err) })
    .catch((err)=>{ next(err) })
});



module.exports = promotionRouter
