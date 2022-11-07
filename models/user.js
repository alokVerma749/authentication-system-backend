const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
},
    {
        timestamps: {
            createdAt: true,
            updatedAt: false
        }
    })

module.exports = mongoose.model('user', userSchema);