const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    number: Number,
    gender: String,
    address: String,
    photo: String,
    type: String,
    verified: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

module.exports = mongoose.model('user', UserSchema);