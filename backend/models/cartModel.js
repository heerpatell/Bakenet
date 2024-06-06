const mongoose = require('mongoose');
const Register = require('../models/signupModel')
const Item = require('../models/itemModel')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Register,
        required: true
    },
    flag:{
       default:'unordered',
       type:String
    },
    bakerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Register,
        required: true
    },
    itemIds: [
        {
            _id:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Item,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
})

module.exports = mongoose.model("Cart", cartSchema);
