const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = 5000;

const signuproute = require('./routes/signRoute')
const profileroute = require('./routes/profileRoute')
const categoryRoute = require('./routes/CategoryRoute')
const itemRoute = require('./routes/itemRoute')
const cartRoute = require('./routes/cartRoute')
const orderRoute=require('./routes/orderRoute')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
}))

//when it is set to false, that means all the fields will be saved in the database, even if some of them are not specified in the schema model
mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://amanahmedabad:M5Ihe6sh24AtE67B@ahcluster.ch4vlrq.mongodb.net/?retryWrites=true&w=majority'
    // useFindAndModify : false,
    // useCreateIndex:true,
    // useNewUrlParser:true,
    // useUnifiedTopology:true
)
.then( () => {
    console.log('Connected to database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
})

app.use("/auth",signuproute)
app.use("/prof",profileroute)
app.use('/cat',categoryRoute)
app.use('/item',itemRoute)
app.use('/cart',cartRoute)
app.use('/order',orderRoute)

app.listen(port,(req,res)=>{
    console.log(`Your server is running on ${port}`);
})