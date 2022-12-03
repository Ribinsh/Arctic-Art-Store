// const dotenv = require('dotenv');
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/ArcticData')

const db= 'mongodb+srv://Arctic:MSwUYeGUx68VZK3u@cluster0.lrxtwpr.mongodb.net/ArcticData?retryWrites=true&w=majority';
mongoose.connect(db,{
    useNewUrlParser : true,
    useUnifiedtopology : true,
    
})

mongoose.connection
.once("open",()=>console.log("database connected successfully"))
.on("error", error =>{

    console.log("error", error);
})