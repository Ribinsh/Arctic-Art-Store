const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },

    email : {
        type :String,
        required : true,
        unique : true
    },

    phone : {
        type : Number ,
        required : true
    },

    password : {
        type : String,
        required : true
    },
    status : {
        type: String,
        default: 'Unblocked'

    }
})

module.exports = signupModel = mongoose.model('UserData',userSchema);