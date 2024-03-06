const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    rooms: [String]
})

module.exports = mongoose.model('users', UserSchema)