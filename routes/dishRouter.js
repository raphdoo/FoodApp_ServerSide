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
    dishes.remove({})
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

dishRouter.route("/:dishID/comments")
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    next()
})
.get((req, res, next) => {
    dishes.findById(req.params.dishID)
    .then((dish)=>{
        if (dish != null){
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.send(dish.comments)
        } else {
            err = new Error("Dish" + req.params.dishID + "not found")
            err.status = 404
            return next(err)
        }
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.post((req, res, next) => {
    dishes.findById(req.params.dishID)
    .then(dish =>{
        if(dish != null){
            dish.comments.push(req.body)

            dish.save()
            .then((dish)=>{
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.send(dish)
            })
        }else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
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
    dishes.findById(req.params.dishID)
    .then(dish =>{
        if (dish != null){
            for (var i = (dish.comments.length -1); i >=0; i--){
                dish.comment.id(dish.comment[i]._id).remove()
            }
            dish.save()
            .then(dish => {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.send(dish)
            })
        }else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }    
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
});


dishRouter.route("/:dishID/comments/:commentID")
.get((req, res, next) => {
    dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentID) != null){
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.send(dish.comments.id(req.params.commentID))
        } else if(dish == null){
            err = new Error('Dish ' + req.params.dishID + ' not found');
            err.status = 404;
            return next(err);
        }else{
            err = new Error('comment ' + req.params.commentID + ' not found');
            err.status = 404;
            return next(err);
        }
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
    dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentID) != null){
            if(req.body.rating){
                dish.comments.id(req.params.commentID).rating = req.body.rating
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentID).comment = req.body.comment
            }
            dish.save()
            .then(dish =>{
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.send(dish)
            })
        }else if(dish == null){
            err = new Error('Dish ' + req.params.dishID + ' not found');
            err.status = 404;
            return next(err);
        }else{
            err = new Error('comment ' + req.params.commentID + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
})
.delete((req, res, next) => {
    dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentID) != null){
            dish.comments.id(req.params.commentID).remove()

            dish.save()
            .then(dish =>{
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.send(dish)
            })
        }else if(dish == null){
            err = new Error('Dish ' + req.params.dishID + ' not found');
            err.status = 404;
            return next(err);
        }else{
            err = new Error('comment ' + req.params.commentID + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err)=>{ next(err) })
    .catch((err)=>{
        next(err)
    })
});


module.exports = dishRouter;