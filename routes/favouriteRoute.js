const express = require("express");
const bodyParser = require('body-parser');

const mongoose = require("mongoose");
const favourites = require("../model/favourite");
const Dishes = require('../model/dishSchema')
const authenticate = require('../authenticate');
const cors = require('./cors')

favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json())

favouriteRouter.route("/")
.options(cors.corsWithOptions, (req, res)=> { res.sendStatus(200); })
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    next()
})
.get(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    favourites.findOne({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favourites) =>{
        res.statusCode = 200
        res.send(favourites)
        
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favourites.findOne({user:req.user._id})
    .then((favourite)=>{
        if(favourite){
            for (let i=o; i<favourite.length; i++){
                if(favourite.dishes.indexOf(req.body[i]._id) !== -1){
                favourite.dishes.push(req.body[i]._id)
            }
            }
            favourite.save()
            .then((favourite)=>{
                console.log(`favourite created : ${favourite}`)
                res.status = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favourite)
            }, err => next(err))
        }
        else{
            favourites.create({user:req.user._id, dishes:req.body})
            .then((favourite)=>{
                console.log(`Favourite created: ${favourite}`)
                res.status = 200
                res.setHeader = ('Content-Type', 'application/json')
                res.json(favourite)
            }, (err)=> next(err))
        }
        
    })
    .catch((err)=> next(err))
    
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) =>{
    res.statusCode = 403;
    res.end(`put operation not supported on /favourites`)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
    favourites.findOneAndRemove({user:req.user._id})
    .then((resp) =>{

        res.status = 200
        res.setHeader("Content-Type", "application/json")
        res.send(resp)
    }, (err) => { next(err) })
    .catch((err)=>{
        next(err)
    })
});

favouriteRouter.route("/:dishID")
.options(cors.corsWithOptions, (req, res)=> { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.dishId);
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favourites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishID)
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
            }
        }
        else {
            favourites.create({user: req.user._id, dishes: [req.params.dishID]})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);  
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favourites.findOne({user:req.user._id})
    .then((favourite)=>{
        if(favourite){
            index = favourite.dishes.indexOf(req.params.dishID);
            if(index >= 0){
                favourite.dishes.splice(index, 1)
                favourite.save()
                .then((favourite)=>{
                    console.log(`Favourite deleted: ${favourite}`)
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json')
                    res.json(favourite)
                }, (err)=>next(err))
            }
            else{
                var err = new Error(`Dish with id ${req.params.dishID} not found`);
                err.status = 403;
                return next(err)
            }
        }
        else{
            var err = new Error('favourite not found')
            err.status = 403;
            return next(err)
        }
    }, (err)=> next(err))
    .catch((err)=>{ next(err) })
});



module.exports = favouriteRouter
