const express = require('express')
const router = express.Router()
const Item = require('../models/itemModel')
const Register = require('../models/signupModel')
const multer = require('multer')

const storage = multer.diskStorage({
    filename:(req,file,callback)=>{
        callback(null,Date.now()+file.originalname)
    },
    destination:(req,file,callback)=>{
        callback(null,'../frontend/src/uploads/')
    }
})
const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*3
    },
})

router.route('/additem').post(upload.single('iphoto'),async(req,res)=>{
    
    const token = req.cookies.jwt;
    const userId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    const photo = req.file.filename
    const cname = req.body.cname;
    const iname = req.body.iname;
    const description = req.body.description;
    const price = req.body.price;
    const iphoto = photo;
    
    const newItem = new Item({
        cname,iname,description,price,iphoto,
        userId:userId
    })
    // console.log(newItem)
    const item = await newItem.save()  
    res.status(201).send({msg:"success"})  
})

router.route('/getitemsforbaker/:catname').get(async(req,res)=>{
    const token = req.cookies.jwt;
    const catname = req.params.catname
    const userId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    const userObj = await Item.find({userId}) && await Item.find({cname:catname})
    if(userObj){
        res.status(201).send({msg:'success',userObj})
    }else{
        res.status(201).send({msg:'no items'})
    }
})

router.route('/getitemsforcustomer').post(async(req,res)=>{
   let bakerDetails = []
   let itemDetails = []
   const rest = await Item.find({})

   bakerDetails = await Register.find({bname:req.body.bakeryname})
   bakerId = bakerDetails[0]._id

   itemDetails = await Item.find({userId:bakerId})
//    console.log(65, itemDetails);
   
   if(itemDetails.length>=1){
    res.status(201).send({msg:'all items received',itemDetails})
   }
   else{
    res.status(201).send({msg:'no items received'});
   }
})

router.route('/delitem/:iname').post(async(req,res)=>{
   const iname = req.params.iname

//console.log(iname)
   await Item.findOneAndDelete(iname).exec()
   .then(()=>{
       res.status(201).send({msg:"deleted"})
   })
   .catch((e)=>{
       console.log("error ",e)
   })

})

module.exports = router