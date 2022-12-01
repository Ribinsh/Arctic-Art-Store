const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const couponSchema = new Schema({
    couponName: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    
    minAmount: {
        type: Number,
        required: true
    }
})
module.exports= Coupen = mongoose.model('coupen',couponSchema)