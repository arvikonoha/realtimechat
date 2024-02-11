const Message = require('../models/Message')

module.exports.getMessagesForID = function getMessagesForID(from, to) {
    return Message.find({$or: [{from, to}, {from:to, to: from}]})
    .populate({
        path: 'from',
        _id: '_id',
        select: 'name' // Specify the fields you want to select from the referenced Author document
    })
    .sort({ timestamp: -1 }) // -1 for descending order
}

module.exports.create = function create(messageDetails) {
    const message = new Message(messageDetails)
    return message.save()
}

module.exports.getMessagesForRoom = function getMessagesForRoom(room) {
    return Message.find({room})
    .populate({
        path: 'from',
        _id: '_id',
        select: 'name' // Specify the fields you want to select from the referenced Author document
      })
    .sort({ timestamp: -1 }) // -1 for descending order
}