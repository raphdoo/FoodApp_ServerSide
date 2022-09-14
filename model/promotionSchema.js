//importing the mongoose ORM
const mongoose = require("mongoose")
const Schema = mongoose.Schema

//creating the data type 'currency' for the model
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency

//modelling the promotion schema
const promotionSchema = new Schema({
    name: {
        type : String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    }
})

const promotions = mongoose.model("promotion", promotionSchema) //creating the model

module.exports = promotions //exporting the created model