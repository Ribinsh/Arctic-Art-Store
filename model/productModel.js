const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    status : {
        type:String,
        default: "list"
    }
    

})

module.exports= Product = mongoose.model('Product',productSchema)