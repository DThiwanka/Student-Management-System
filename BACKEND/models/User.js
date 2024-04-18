const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userFullName:{

        type: String,
        required: true,
        trim: true,
    },

    userEmail:{
        type: String,
        required: true,
        trim: true,
    },

    userContactNo:{
        type: Number,
        required: true,
        trim : true,

    },

    userNIC:{
        type: String,
        required: true,
        trim: true,
    },

    userGender:{
        type: String,
        required: true,
        trim: true,
    },

    userAddress:{
        type: String,
        required: true,
        trim: true,
    },

    studentId:{
        type: String,
        required: true,
        trim: true,
    },

    password:{
        type: String,
        required: true,
        trim: true,
    },
    
})

const userModel = mongoose.model('users',userSchema)
module.exports = userModel;