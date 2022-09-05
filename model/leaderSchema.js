//importing the mongoose database ORM
const mongoose = require("mongoose")
const Schema = mongoose.Schema

//configuring for data type - Currency
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency

//modelling the leader schema
const leaderSchema = new Schema({
    name: {
        type : String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
})

const leaders = mongoose.model("leader", leaderSchema) //creating the model

module.exports = leaders //exporting the created model