const orm = require('../orm')

module.exports.getMessagesForRoom = async (req, res) => {
    try {
        const {room, project} = req.query
        const messages = await orm.messages.getMessagesForRoom({room, project})
        return res.json({messages})
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }
}


module.exports.getMessagesForID = async (req, res) => {
    try {
        const {from, to, project} = req.query
        const messages = await orm.messages.getMessagesForID({from, to, project})
        res.json({messages})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}