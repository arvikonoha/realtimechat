const routes = require('express').Router()
const middlewares = require('../middlewares')
const controllers = require('../controllers')

routes.use(middlewares.auth.authenticate)
routes.get('/by-room', controllers.messages.getMessagesForRoom)
routes.get('/by-id', controllers.messages.getMessagesForID)

module.exports = routes