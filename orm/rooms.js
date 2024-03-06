const Room = require("../models/Room")

module.exports.create = (roomDetails) => {
    const roomDocument = new Room(roomDetails)
    return roomDocument.save()
}

module.exports.list = (filters = {}) => {
    return Room.find(filters)
}