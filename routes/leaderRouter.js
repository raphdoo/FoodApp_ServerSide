const express = require("express");
const bodyParser = require('body-parser');

leadersRouter = express.Router();

leadersRouter.use(bodyParser.json())

leadersRouter.route("/")
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    next()
})
.get((req, res, next) => {
    res.end(`This will send all the leaders name and email`)
})
.post((req, res, next) => {
    res.end(`This will add the leader name: ${req.body.name} and the description: ${req.body.description}`)
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.end(`This method is not allowed here`)
})
.delete((req, res, next) =>{
    res.end(`This will delete all the leaders`)
});


leadersRouter.route("/:dishID")
.get((req, res, next) => {
    res.end(`This will get leader with id: ${req.params.dishID}`)
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`This method is not supported` )
})
.put((req, res, next) => {
    res.end(`This method will update leader name: ${req.body.name} and description: ${req.body.description} for dish with id: ${req.params.dishID}`);
})
.delete((req, res, next) => {
    res.end(`This will delete leader with id: ${req.params.dishID}`)
});



module.exports = leadersRouter
