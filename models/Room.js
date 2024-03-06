const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    project: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: false
    },
})

module.exports = mongoose.model('rooms', Schema)