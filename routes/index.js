const routes = require('express').Router()
const middlewares = require('../middlewares')
const uuid = require("uuid");

routes.use('/auth', require('./auth'))
routes.use('/users', require('./users'))
routes.use('/rooms', require('./rooms'))
routes.use('/messages', require('./messages'))
routes.use('/projects', require('./projects'))

module.exports.routes = routes