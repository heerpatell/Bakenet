const mongoose = require('mongoose')
const Category = require('./catModel')
const Register = require('./signupModel')

const itechSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Register,
        required: true  
    },
    cname:{
       type:String
    },
    iname:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    iphoto:{
        type:String
    }
})

module.exports = mongoose.model("Item", itechSchema)