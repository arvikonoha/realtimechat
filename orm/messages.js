const Message = require('../models/Message')

module.exports.getMessagesForID = function getMessagesForID(id, selfMessages=false) {
    const selfMessageFilter = !selfMessages
        ? {$expr: {
        $ne: ['$from', '$to']
        }}:{$expr: {
            $eq: ['$from', '$to']
        }};
    return Message.find({$or: [{from: id}, {to: id}],...selfMessageFilter})
    .sort({ timestamp: -1 }) // -1 for descending order

}

module.exports.create = function create(messageDetails) {
    const message = new Message(messageDetails)
    return message.save()
}