const ioHandler = require('../utils').sockets.ioHandler

module.exports.initializeProject = (req, res) => {
    try {
        const {name} = req.params
        if (!name) return res.status(400).json({error: 'Project name is Invalid'})
        console.log('Initializing external project :', name)
        ioHandler(req.io, name)
        res.json({status: 'OK'})
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
}