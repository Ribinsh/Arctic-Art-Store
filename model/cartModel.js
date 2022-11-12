const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const cartSchema = new mongoose.Schema({
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




    // user : {
    //     type: ObjectId,
    //     required: true,
    //     ref:"UserData"
    // },
    // product : {
    //     type: ObjectId,
    //     required: true,
    //     ref: "Product"
    // }
    
    

})

module.exports= cartProduct = mongoose.model('cartProduct',cartSchema)