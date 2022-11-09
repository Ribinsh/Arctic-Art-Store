const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    productName :{
        type:String,
        required:true
    },
    description :{
        type:String,
        required: true        
    },
    price :{
        type:String,
        required:true
    },
    imageUrl : {
        type:String,
        required: true
    },
    
    

})

module.exports= wishlistProduct = mongoose.model('wishlistProducts',wishlistSchema)