const routes = require('express').Router()
const middlewares = require('../middlewares')
const uuid = require("uuid");

routes.use('/auth', require('./auth'))
routes.use('/users', require('./users'))
routes.use('/rooms', require('./room'))

module.exports.routes = routes
module.exports.ioHandler = (io) => {

    io.engine.generateId = () => {
        return uuid.v4(); // must be unique across all Socket.IO servers
    }

    io.engine.use((req, res, next) => {
        const isHandshake = req._query.sid === undefined;

        if (!isHandshake) {
            return next();
        }

        middlewares.auth.authenticate(req, res, next)
    });
    io.of('/chat').on('connection', require('../controllers').socket(io, 'chat',))
}