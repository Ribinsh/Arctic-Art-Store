const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({

    title :{
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
    } ,
    category:{
        type:String,
        required:true
    },

})

module.exports= Banner = mongoose.model('Banner',bannerSchema)
