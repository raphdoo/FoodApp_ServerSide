const mongoose = require("mongoose")
const Schema = mongoose.Schema

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency

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

const leaders = mongoose.model("leader", leaderSchema)

module.exports = leaders