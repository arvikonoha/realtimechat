const Message = require('../models/Message')

module.exports.getMessagesForID = function getMessagesForID(from, to) {
    return Message.find({from, to})
    .sort({ timestamp: -1 }) // -1 for descending order
}

module.exports.create = function create(messageDetails) {
    const message = new Message(messageDetails)
    return message.save()
}