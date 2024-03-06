const routes = require('express').Router()
const controllers = require('../controllers')

routes.put('/:name', controllers.projects.initializeProject)

module.exports = routes