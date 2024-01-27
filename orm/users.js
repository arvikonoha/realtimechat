const User = require("../models/User")

module.exports.getByName = function getByName(name) {
    return User.find({name})
}

module.exports.create = function create(userDetails) {
    const user = new User(userDetails)
    return user.save()
}

module.exports.list = function list(filter, limit, offset) {
    return User.find(filter).select('name id rooms').limit(limit).skip(offset)
}