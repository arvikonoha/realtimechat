const orm = require('../orm')

module.exports.create = async (req, res) => {
    try {
        const {name} = req.body
        const {_id: admin} = req.user
        if (!name) return res.status(400).json({message: 'Room name not sent'})
        
        const room = await orm.room.list({name})
        
        if (room.length) return res.status(400).json({message: 'Room already exists with this name'})

        const response = await orm.room.create(name, admin)

        res.json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal serfver error'})
    }
}