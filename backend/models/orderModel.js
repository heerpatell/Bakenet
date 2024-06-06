const express = require('express')
const mongoose = require('mongoose')
const Register = require('./signupModel')
const Item = require('./itemModel')

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Register,
        required: true
    },
    bakerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Register,
        required: true
    },
    oDate: {
        type: Date,
        default: Date.now
    },
    ostatus: {
        type: String,
        default: 'Pending'
    },
    itemIds: [
        {
            _id:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Item,
                required: true
            },
            iname:{
                type:String
            },
            price:{
                type:Number
            },
            quantity: {
                type: Number
            }
        }
    ]
})

module.exports = mongoose.model('Order', orderSchema)