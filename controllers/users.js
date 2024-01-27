const orm = require('../orm')

module.exports.list = async function list(req, res) {
    const {filter, limit, offset} = req.query
    const users = await orm.users.list(filter, limit, offset) 
    return res.json(users)
}