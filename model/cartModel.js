const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'userData'
       }, 
    
       products: {
        type:[{
                productId: { type:mongoose.Schema.Types.ObjectId, ref: 'Product'},
                quantity: {type:Number , default:  1 },
                total : {type: Number},
                
            }],
        },
        cartTotal : {
            type: Number,
            default: 0                
        }
})

module.exports= cartProduct = mongoose.model('cartProduct',cartSchema)