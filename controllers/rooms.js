const orm = require('../orm')

module.exports.create = async (req, res) => {
    try {
        const {name, project='chat'} = req.body
        const {_id: admin} = req.user
        if (!name) return res.status(400).json({message: 'Room name not sent'})
        
        const room = await orm.rooms.list({name, project})
        
        if (room.length) return res.status(400).json({message: 'Room already exists with this name'})
        
        const response = await orm.rooms.create({name, admin, project})
        
        res.json(response)
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.getOrCreateDiscussion = async (req, res) => {
    try {
        const {name, project} = req.params
        const room = await orm.rooms.list({name, project})
        if (room.length) return res.json(room[0])
        const response = await orm.rooms.create({name,project})
        return res.json(response)
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }
}