const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    categoryName :{
        type:String,
        required:true
    },
    description :{
        type:String,
        required: true        
    }, 
    imageUrl : {
        type:String,
        required: true
    } 

})

module.exports= Category = mongoose.model('Category',categorySchema)
