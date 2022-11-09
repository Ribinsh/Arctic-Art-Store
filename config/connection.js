// const dotenv = require('dotenv');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ArcticData')

const db = mongoose.connection
db.once("open",()=>console.log("database connected successfully"))
db.on("error", error =>{

    console.log("error", error);
})