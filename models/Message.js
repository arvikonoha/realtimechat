const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model('message', MessageSchema)