const { users } = require('../controllers')

const routes = require('express').Router()
const middlewares = require("../middlewares")

routes.use(middlewares.auth.authenticate)

/**
 * @openapi
 * '/users/list':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get all users who have used the app
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
routes.get('/list', users.list)

module.exports = routes