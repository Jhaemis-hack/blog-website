const mongoose = require('mongoose');


const Schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', Schema);

module.exports = User;