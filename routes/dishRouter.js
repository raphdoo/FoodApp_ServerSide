const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route("/")
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    next()
})
.get((req, res, next) => {
    res.end(`This will send all the dish name and description`)
})
.post((req, res, next) => {
    res.end(`This will send all the dish name: ${req.body.name} and the description: ${req.body.description}`)
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.end(`This method is not allowed here`)
})
.delete((req, res, next) =>{
    res.end(`This will delete all the dishes`)
});


dishRouter.route("/:dishID")
.get((req, res, next) => {
    res.end(`This will get dish with id: ${req.params.dishID}`)
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`This method is not supported` )
})
.put((req, res, next) => {
    res.end(`This method will update dish name: ${req.body.name} and description: ${req.body.description} for dish with id: ${req.params.dishID}`);
})
.delete((req, res, next) => {
    res.end(`This will delete dish with id: ${req.params.dishID}`)
});





module.exports = dishRouter;