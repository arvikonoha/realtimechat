const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
    },
    content: {
        type: String,
        required: true
    },
    media: [{
        key: String,
        description: String,
    }],
    "project": {
        type: String
    },
    timestamp: { type: Date, default: Date.now },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'rooms',
        required: true,
        default: 'chat',
    }
})

module.exports = mongoose.model('message', MessageSchema)