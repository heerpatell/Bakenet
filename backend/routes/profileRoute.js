const express = require('express')
const router = express.Router()
// import Register from '../models/signupModel'
const Register = require('../models/signupModel')
const {customerProfile} = require('../validator') 
const {bakerProfile} = require('../validator')

router.route('/submit').post(async(req,res)=>{
    const obj = {city:req.body.city, area:req.body.area, cont: req.body.cont}
    const {error} = customerProfile(obj)
    if(error){
        console.log(10,error)
        res.status(201).send({error:error.details[0].message})
    } 
    try{
        const user = await Register.findById(req.body.userId)
        // console.log(user)
    
        Register.updateOne(
            {"_id": user._id},
            {
                $set: {
                        "city":req.body.city,
                        "area":req.body.area,
                        "contact":req.body.cont
                    }
            },((e,r)=>{
                console.log(27, r)
            })
        )  
        res.status(201).send({msg:"Documnet updated successfully"})  
    }catch(e){

    }
})

router.route('/bakersubmit').post(async(req,res)=>{
    const obj = {
        bname:req.body.bname, whatdousell:req.body.whatdousell,
        availTime:req.body.availTime,city:req.body.city, 
        area:req.body.area, cont: req.body.cont,socialmedia:req.body.socialmedia
    }
    const {error} = bakerProfile(obj)
    if(error){
        // console.log(10,error)
        res.status(201).send({error:error.details[0].message})
    } 
    try{
        const user = await Register.findById(req.body.uid)
        Register.updateOne(
            {"_id": user._id},
            {
                $set: {
                        "bname":req.body.bname,
                        "area":req.body.area,
                        "contact":req.body.cont,
                        "socialmedia":req.body.socialmedia,
                        "city":req.body.city,
                        "availtiming":req.body.availTime,
                        "whatdousell":req.body.whatdousell,            
                    }
            },
            (err,res)=>{
                if(err) {res.status(201).send({msg:"error"})}
                //else {res.status(201).send({msg:"updated successfully"})}
            }
        )
        res.status(201).send({msg:"updated successfully"})
    }catch(e){
        console.log(57,e)
    }

})

module.exports = router