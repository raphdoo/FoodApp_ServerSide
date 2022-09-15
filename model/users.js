//importing the mongoose database ORM
const mongoose = require("mongoose")
const Schema = mongoose.Schema

//modelling the leader schema
const UserSchema = new Schema({
    username: {
        type : String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
})

const users = mongoose.model("User", UserSchema) //creating the model

module.exports = users //exporting the created model