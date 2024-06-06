const mongoose = require('mongoose');
const Register = require('../models/signupModel')

const categorySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Register,
        required: true
    },
    categoryname:{
        type:String,
        unique:true,
        required:true
    }
})

module.exports=mongoose.model("Category",categorySchema);
