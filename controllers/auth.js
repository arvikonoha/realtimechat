const orm = require('../orm')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
module.exports.register = async function register(req, res) {
    try {
        // TODO: Replace URL with conf value
        const response = await axios.post('http://localhost:3000/v1/auth/register', req.body)
        if (response.status === 200) {
            const { token, user } = response.data
            await orm.users.create(user)
            return res.json({ token })
        } else {
            return res.status(response.status).json(response.data)
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports.login = async function login(req, res) {
    try {
        // TODO: Replace URL with conf value
        const response = await axios.post('http://localhost:3000/v1/auth/login', req.body)
        if (response.status === 200) {
            let existingUser = await orm.users.getByName(response.data.user.name)
            if (existingUser === null) await orm.users.create(response.data.user)
            
            return res.status(response.status).json({token: response.data.token})
        }
        return res.status(response.status).json(response.data)
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports.integration = async function integration(req, res) {
    try {
        const { partner, publicKey } = req.body
        if (!partner || !publicKey) return res.status(400).json({ error: 'Payload must have partner and publicKey' })
        fs.writeFileSync(path.join(__dirname, '..', 'keys', `${partner}-public.key`), publicKey)
        return res.json({
            message: `Partner ${partner} successfully added`
        })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add partner, publicKey' })
    }
}
