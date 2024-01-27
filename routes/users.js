const { users } = require('../controllers')

const routes = require('express').Router()
const middlewares = require("../middlewares")

routes.use(middlewares.auth.authenticate)
routes.get('/list', users.list)

module.exports = routes