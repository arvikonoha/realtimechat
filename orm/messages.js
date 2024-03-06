const Message = require('../models/Message')

module.exports.getMessagesForID = function getMessagesForID({from, to, project}) {
    return Message.find({$or: [{from, to}, {from:to, to: from}], project})
    .populate({
        path: 'room',
        _id: '_id',
        match: {name: 'chat'},
        select: 'name',
    })
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

module.exports.getMessagesForRoom = function getMessagesForRoom({room, project}) {
    return Message.find({room, project})
    .populate({
        path: 'from',
        _id: '_id',
        select: 'name' // Specify the fields you want to select from the referenced Author document
      })
    .sort({ timestamp: -1 }) // -1 for descending order
}