const { auth } = require('./../controllers')

const routes = require('express').Router()

routes.post('/register', auth.register)
routes.post('/login', auth.login)
routes.post('/integration', auth.integration)

module.exports = routes