const Room = require("../models/Room")

module.exports.create = (name, admin) => {
    const roomDocument = new Room({name, admin})
    return roomDocument.save()
}

module.exports.list = (filters = {}) => {
    return Room.find(filters)
}