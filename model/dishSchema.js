//importing the mongoose database ORM
const mongoose = require("mongoose")
const Schema = mongoose.Schema;


//configuring for data type - Currency
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency

//modelling the comment Schema
const commentSchema = new Schema({
    rating: {
        type : Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
})

//modelling the dish schema
const dishSchema = new Schema({
    name: {
        type : String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    comments: [ commentSchema ]
},{
    timestamps: true 
})

const dishes = mongoose.model('dish', dishSchema)

module.exports = dishes