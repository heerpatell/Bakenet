require('dotenv').config()
const mongoose = require('mongoose');

const signSchema = new mongoose.Schema({
    name:{
        type : String,
        // required : true        
    },
    uname:{
        type : String,
        // required : true,
        unique: true
    },
    email:{
        type : String,
        // required : true,
        unique:true
    },
    pswd:{
        type : String,
        // required : true
    },
    stoken:{
        type : String,
        // required : true
    },
    contact:{
        type: String,
        unique: true
    },
    area:{
        type: String
    },
    city:{
        type: String
    },
    bname:{
        type:String
    },
    availtiming:{
        type:String
    },
    whatdousell:{
        type:String
    },
    socialmedia:{
        type:String
    }
})

module.exports=mongoose.model("Register",signSchema);
