const routes = require('express').Router()
const middlewares = require('../middlewares')
const controllers = require('../controllers')

routes.use(middlewares.auth.authenticate)
routes.post('/', controllers.rooms.create)
routes.put('/:name/project/:project', controllers.rooms.getOrCreateDiscussion)

module.exports = routes