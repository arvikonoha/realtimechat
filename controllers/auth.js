const orm = require('../orm')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname,'..','keys', 'private.key')).toString()
module.exports.register = async function register(req, res) {
    const {name, password} = req.body
    const existingUsers = await orm.users.getByName(name)
    if (existingUsers.length) return res.status(402).json({
        message: 'User already exists'
    })

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const id = await orm.user.create({
        name,
        password: hashedPassword
    })

    const token = jwt.sign({
        sub: id
    }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: 1200000 });
    
    res.json({
        token
    })
}

module.exports.login = async function login(req, res) {
    const {name, password} = req.body
    const existingUsers = await orm.users.getByName(name)
    if (!existingUsers.length) res.status(403).json({
        message: 'Username or password is invalid'
    })
    const {password: hashedPassword, id} = existingUsers[0]

    const isValidPassword = await bcrypt.compare(password, hashedPassword)

    if (!isValidPassword) return res.status(403).json({message: 'Username or password is invalid'})

    const token = jwt.sign({
        sub: id
    }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: 1200000 });
    
    res.json({
        token
    })
}