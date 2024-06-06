const express = require('express')
const router = express.Router()
const Category = require('../models/catModel')
const Item = require('../models/itemModel')

router.route('/add').post(async(req,res)=>{
    try{
        console.log(req.body)

        const catName = req.body.input
        const userId = req.body.userId

        const newCategory = new Category({
            categoryname:catName,
            userId
        })

        await newCategory.save()

        res.status(201).send({msg:"cat added"})
    }
    catch(e){
        console.log("err ",e)
    }
})

router.route('/getcat').get(async(req,res)=>{    
    const token = req.cookies.jwt;
    const userId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    // console.log(userId)

    const userObj = await Category.find({userId})
    if(userObj){
        // console.log(userObj)
        const categories = []
        for(let i=0;i<userObj.length;i++){
            categories[i] = (userObj[i].categoryname)
        }
        // console.log(categories)
        res.status(201).send(categories)    
    }else{
        res.status(201).send({message:"no categories added by baker"})
    }
})

router.route('/delete/:name').delete(async(req,res)=>{
    const name = req.params.name

    await Category.findOneAndDelete({categoryname:name}).exec() && Item.findOneAndDelete({cname:name}).exec()
    .then(()=>{
        res.status(201).send({msg:"deleted"})
    })
    .catch((e)=>{
        console.log("error ",e)
    })
})

module.exports = router