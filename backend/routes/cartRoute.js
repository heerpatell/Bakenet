const express = require("express");
const router = express.Router();
const Register = require("../models/signupModel");
const Cart = require("../models/cartModel");
const Item = require("../models/itemModel");
const { mongoose } = require("mongoose");

router.route("/additem").post(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  // const itemSet = await Item.find({_id:req.body.id})
  const newItemId = { _id: req.body.id, quantity: req.body.quantity + 1 };

  const bakerDetails = await Register.find({ bname: req.body.bakeryname });
  const bakerId = bakerDetails[0]._id;

  let used = 1;

  let existedUser = await Cart.find({ userId:userId._id, bakerId , flag :'unordered'});
  existedUser = JSON.parse(JSON.stringify(existedUser));

  console.log(2233, existedUser, existedUser.length)
  if (existedUser.length < 1 ) {
    // console.log(2244, existedUser)
    const newCart = new Cart({
      userId,
      bakerId,
      itemIds: [newItemId],
    }).save();
    // console.log(31, newCart)
  }
  if(existedUser.length >= 1){
    // console.log('here')
    // console.log(22444, existedUser)
    for (let i = 0; i < existedUser.length; i++) {
      console.log(24, existedUser[i].bakerId, bakerId);
      if (existedUser[i].bakerId == bakerId && used == 1) {
        Cart.findOneAndUpdate(
          { userId,bakerId, flag:'unordered' },
          { $push: { itemIds: newItemId } }
        ).exec();
      }
      if (existedUser[i].bakerId != bakerId) {
        const newCart = new Cart({
          userId,
          bakerId,
          itemIds: [newItemId],
        });
        used = 0;
        const item = await newCart.save();
      }
    }  
  }
  res.status(201).send({ msg: "success" });
});

router.route("/getcartcount").get(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  //we can also use this -> find(userId:userId._id)
  let userObj = await Cart.find({ userId:userId._id, flag:'unordered' });
  userObj = JSON.parse(JSON.stringify(userObj));
  console.log("length of itemIds ", userObj.length);

  let count = 0,
    itemIds = [];
  if (userObj == undefined) {
    res.status(201).send({ msg: "success", count });
  } else {
    for (let i = 0; i < userObj.length; i++) {
      if (userObj[i] != undefined && userObj[i].flag == "unordered") {
        count += userObj[i].itemIds.length;
        itemIds = [...itemIds, userObj[i].itemIds];
        // console.log(62, userObj[i].bakerId)
        const bakerDoc = await Register.find({ _id: userObj[i].bakerId });
        itemIds[i]["bname"] = bakerDoc[0].bname;
      }
    }
    console.log(78, itemIds[0]);

    res.status(201).send({ msg: "success", count, itemList: itemIds[0] });
  }
  //console.log(itemIds)
});

router.route("/getitemsinrecentorder").get(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  let existedUser = await Cart.find({ userId });
  existedUser = JSON.parse(JSON.stringify(existedUser));

  for(let i=0;i<existedUser.length;i++){
    let totalPrice = 0
    const bakerDoc = await Register.find({_id:existedUser[i].bakerId})
    existedUser[i]['bname'] = bakerDoc[0].bname
    // console.log(94, existedUser[i]['flag'])
    if(existedUser[i]['flag']!='ordered'){
      for(let j=0;j<existedUser[i].itemIds.length;j++){
        const itemDoc= await Item.find({_id:existedUser[i].itemIds[j]._id})
        existedUser[i].itemIds[j]['iname'] = itemDoc[0].iname
        existedUser[i].itemIds[j]['price'] = itemDoc[0].price
        totalPrice = totalPrice + (existedUser[i].itemIds[j].price * existedUser[i].itemIds[j].quantity) 
      }  
      existedUser[i]['totalPrice'] = totalPrice
    }
  } 
    console.log(96, existedUser) 

    res.status(201).send({ msg: "success", existedUser });
});

router.route("/deleteitemfromcart").post(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  let userDoc = await Register.find({bname: req.body.bname})
  
  await Cart.findOneAndDelete({userId: userId._id, bakerId:userDoc._id})
  res.status(201).send({ msg: "success" });
});

router.route("/addquantity").post(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const existedUser = await Cart.find({ userId });
  const allItems = existedUser[0].itemIds;

  const check = await Cart.findOneAndUpdate(
    {
      userId: userId,
      "itemIds._id": req.body.id,
    },
    {
      $set: { "itemIds.$.quantity": req.body.quant + 1 },
    },
    { new: true }
  );
  res.status(201).send({ msg: "success" });
});

router.route("/minusquantity").post(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const existedUser = await Cart.find({ userId });
  const allItems = existedUser[0].itemIds;

  const check = await Cart.findOneAndUpdate(
    {
      userId: userId,
      "itemIds._id": req.body.id,
    },
    {
      $set: { "itemIds.$.quantity": req.body.quant - 1 },
    },
    { new: true }
  );
  res.status(201).send({ msg: "success" });
});

router.route("/fetchbakers").get(async (req, res) => {
  const token = req.cookies.jwt;
  const userId = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  let user = await Register.find({ _id: userId });
  user = user[0];
  user_city = user.city; //logged_in user(customer) city

  let listOfBakers = [];
  listOfBakers = await Register.find({ stoken: "baker", city: user.city });

  res.status(201).send({ msg: "success", listOfBakers, user_city });
});
module.exports = router;
