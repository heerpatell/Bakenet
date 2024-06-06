const express = require('express');
const router = express.Router()
const Register = require('../models/signupModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {signInValidation} = require('../validator')
const {signupValidation} = require('../validator')  

router.route('/register').post( async (req,res)=>{
    const {error} = signupValidation(req.body)
    if(error){
        res.status(201).send({error:error.details[0].message})
    } 
    try {
        //console.log(req.body);
        const name = req.body.name;
        const uname = req.body.uname;
        const email = req.body.email;
        //const pswd = req.body.pswd;
        const stoken = req.body.stoken;

        
        const pswd = await bcrypt.hash(req.body.pswd,10);
        //console.log(pswd);
        const newUser = new Register({
            name,uname,email,pswd,stoken
        }) 

        const reg = await newUser.save()
        
        res.status(201).send({message: "Registered Sucessfully"});
    } catch (e) {
        // console.log(33,e);
    }
})

router.route('/signin').post(async(req,res)=>{
    console.log(38, req.body)
    const {error} = signInValidation(req.body)
    console.log(40, error)
    if(error){
        res.status(201).send({error:error.details[0].message})
    } 
    try{
        const email = req.body.email;
        const pswd = req.body.password;

        const userObj = await Register.findOne({email})
        //console.log(userObj) This tells that userObj is an object consisting of all the details of user whose email is encountered
         if(userObj){
            const isMatch = await bcrypt.compare(pswd.toString(),userObj.pswd); // Both must be string in compare function
            if(isMatch){
                const token = await jwt.sign({_id:userObj._id.toString()},"secretKey",{
                    expiresIn:'1h'
                });
                //console.log(token);
                
                var date = new Date()
                date.setTime(date.getTime() + 3600*1000) //after 1hr
                res.cookie('jwt',token,{
                    httpOnly:true,
                    expires: date
                });
                const userToken = userObj.stoken
                res.status(201).send({msg:"cookie created", userToken});
            }
        } 
    }
    catch(e){
        // console.log(e);
    }
})

router.route('/verify').get(async(req,res)=>{
    const token = req.cookies.jwt;  //to frtch jwt from cookies
    // console.log(token)
    if(token === undefined || token == ''){ //if token does not exist
        res.status(201).send({msg:"access denied"})
    }
    else{
        jwt.verify(token,"secretKey",async(err,decodedToken)=>{
            if(err){    //if wrong or tempered token exists
                console.log(req.data);
                res.status(201).send({msg:"access denied"})
            }
            //console.log(decodedToken) //decodedToken cosists of payload + iat+ exp
            
            const _id = decodedToken._id
            const userObj = await Register.findOne({_id})
            res.status(201).send({userObj,msg:"access granted"})   //if token matches
        })
    }
   
})


router.route('/logout').post(async(req,res)=>{
    const token = req.cookies.jwt;
    // res.clearCookie('jwt')
})

module.exports = router;