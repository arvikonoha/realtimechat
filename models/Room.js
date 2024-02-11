const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
})

module.exports = mongoose.model('rooms', Schema)