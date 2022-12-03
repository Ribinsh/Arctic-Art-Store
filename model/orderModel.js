const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema ({
    userId : {
        type:ObjectId,
        required: true
    },
    products : [{
            productId: { 
                type:ObjectId, 
                ref: 'Product'
            },
            quantity: {type: Number},
            total : { type: Number} ,
            orderStatus : {
                type : String,
                default : 'Order Placed'
            },
    }],
    total : {
        type: Number,
        required:true
    },
    address : {
        type: Object,
        required: true,
       
    },
    paymentMethod : {
        type: String,
        default: "Cash on delivery"
    },
    
    date : {
        type: Date ,
        default : Date.now()
    },
    discount : {
        type : Number,
        default : 0
    }

})
module.exports= order = mongoose.model('Order',orderSchema)