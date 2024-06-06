const express = require("express");
const router = express.Router();
const Cart = require("../models/cartModel");
const Item = require("../models/itemModel");
const Order = require("../models/orderModel");
const Register = require("../models/signupModel");
const { mongoose } = require("mongoose");

router.route("/placeorder").post(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  let fetchData = [];
  fetchData = req.body.fetchData;
 
    // changing flag to ordered from Cart Model
    for(let i=0;i<fetchData.length;i++){
      await Cart.updateMany({
        userId:fetchData[i].userId
       },{$set:{flag:'ordered'}}) 
    }

  //saving cart in Orders table
  let cartId = await Cart.find({ userId: userId._id });
  cartId = JSON.parse(JSON.stringify(cartId));
 
  for(let i=0;i<cartId.length;i++){
    for(let j=0;j<cartId[i].itemIds.length;j++){ 
      let itemDoc = await Item.find({_id:cartId[i].itemIds[j]._id})
      itemDoc = JSON.parse(JSON.stringify(itemDoc));
      itemDoc = itemDoc[0]
      cartId[i].itemIds[j]['iname']=itemDoc.iname,
      cartId[i].itemIds[j]['price']=itemDoc.price
      // console.log(43, cartId[i].itemIds )
    } 
    const newDoc = await Order({
      userId:cartId[i].userId,
      bakerId:cartId[i].bakerId,
      itemIds:cartId[i].itemIds,
    }).save()

    console.log(46,newDoc)
  }
  
  res.status(201).send({ msg: "success" });
});

router.route("/fetchorderes").get(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  //  console.log(userId._id)
  let userObj = await Order.find({ userId: userId._id });
  userObj = JSON.parse(JSON.stringify(userObj));

  if (userObj == undefined) {
    res.status(201).send({ msg: "no order exists" });
  } else {

    for(let i=0;i<userObj.length;i++){
      let bakerDoc = await Register.find({_id:userObj[i].bakerId})
      bakerDoc = JSON.parse(JSON.stringify(bakerDoc));

      userObj[i]['bname'] = bakerDoc[0].bname
      for(let j=0;j<userObj[i].itemIds.length;j++){
          let itemDoc = await Item.find({_id:userObj[i].itemIds[j]._id})
          userObj[i].itemIds[j]['iname'] = itemDoc[0].iname
          userObj[i].itemIds[j]['price'] = itemDoc[0].price
      }
    }
      res.status(201).send({ msg: "success", userObj });
    
  }
});

router.route("/fetchordersforbaker").get(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  let allOrders = await Order.find({bakerId:userId._id});
  // console.log('before ',allOrders, typeof(allOrders))
  //converting mongoose object to normal object
  allOrders = JSON.parse(JSON.stringify(allOrders));
  // console.log('after ',allOrders, typeof(allOrders))
  // console.log(userId._id)
  for(let i=0;i<allOrders.length;i++){
    let userDoc = await Register.find({_id:allOrders[i].userId})
    userDoc = JSON.parse(JSON.stringify(userDoc));
    allOrders[i]['name'] = userDoc[0].name
    allOrders[i]['contact'] = userDoc[0].contact
    for(let j=0;j<allOrders[i].itemIds.length;j++){
      let itemDoc = await Item.find({_id:allOrders[i].itemIds[j]._id})
      itemDoc = JSON.parse(JSON.stringify(itemDoc));
      allOrders[i].itemIds[j]['iname'] = itemDoc[0].iname
      allOrders[i].itemIds[j]['price'] = itemDoc[0].price
    }
  }

  res.status(201).send({ msg: "sent", allOrders });
});

router.route("/orderdone").post(async (req, res) => {

  let cartObj = await Order.find({ _id: req.body.id });
  cartObj = cartObj[0];
  console.log(cartObj);

 await Order.updateOne({_id:req.body.id},{$set:{
  ostatus:'done'
 }})

  res.status(201).send({ msg: "success" });
});

router.route('/fetchorderhistforbaker').get(async(req,res)=>{
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  let allOrders = await Order.find({bakerId:userId._id});
  allOrders = JSON.parse(JSON.stringify(allOrders));

  for(let i=0;i<allOrders.length;i++){
    let userDoc = await Register.find({_id:allOrders[i].userId})
    userDoc = JSON.parse(JSON.stringify(userDoc));
    allOrders[i]['name'] = userDoc[0].name
    allOrders[i]['contact'] = userDoc[0].contact
    if(allOrders[i].ostatus == 'done'){  //if ostatus is done 
      for(let j=0;j<allOrders[i].itemIds.length;j++){
        let itemDoc = await Item.find({_id:allOrders[i].itemIds[j]._id})
        itemDoc = JSON.parse(JSON.stringify(itemDoc));
        allOrders[i].itemIds[j]['iname'] = itemDoc[0].iname
        allOrders[i].itemIds[j]['price'] = itemDoc[0].price
      }
    }
  }
  res.status(201).send({ msg: "sent", allOrders });
})

router.route('/fetchorderhistforcustomer').get(async(req,res)=>{
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  let allOrders = await Order.find({userId:userId._id});
  allOrders = JSON.parse(JSON.stringify(allOrders));

  for(let i=0;i<allOrders.length;i++){
    let userDoc = await Register.find({_id:allOrders[i].userId})
    userDoc = JSON.parse(JSON.stringify(userDoc));
    allOrders[i]['name'] = userDoc[0].name
    allOrders[i]['contact'] = userDoc[0].contact
    if(allOrders[i].ostatus == 'done'){  //if ostatus is done 
      for(let j=0;j<allOrders[i].itemIds.length;j++){
        let itemDoc = await Item.find({_id:allOrders[i].itemIds[j]._id})
        itemDoc = JSON.parse(JSON.stringify(itemDoc));
        allOrders[i].itemIds[j]['iname'] = itemDoc[0].iname
        allOrders[i].itemIds[j]['price'] = itemDoc[0].price
      }
    }
  }
  res.status(201).send({ msg: "sent", allOrders });
})
module.exports = router;
