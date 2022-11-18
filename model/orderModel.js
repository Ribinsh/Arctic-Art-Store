const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema ({
    userId : {
        type:ObjectId,
        required: true
    },
    products : {
        type:[{
            productId: { type:ObjectId, ref: 'Product'},
            quantity: {type:Number  },
            total : {type: Number , required: true},
            
        }],
    },
    total : {
        type: Number,
        required:true
    },
    address : {
        type: ObjectId,
        required: true,
        ref : 'userAddress'
    },
    // paymentMethod : {
    //     type: String
    // },
    orderStatus : {
        type : String,
        default : 'Order placed'
    },
    date : {
        type: Date ,
        default : Date.now()
    }

})
module.exports= order = mongoose.model('Order',orderSchema)