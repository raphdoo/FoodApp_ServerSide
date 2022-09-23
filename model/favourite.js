const mongoose = require('mongoose')
const Schema = mongoose.Schema

const favourites = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'dish'
    }]
},{
    timestamps : true
});

module.exports = mongoose.model('favourite', favourites)