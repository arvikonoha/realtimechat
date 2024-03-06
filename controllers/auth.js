const orm = require('../orm')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
module.exports.register = async function register(req, res) {
    try {
        const response = await axios.post('http://localhost:4329/auth/register', req.body, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.status === 200) {
            const { token, user } = response.data
            await orm.users.create(user)
            return res.json({ token })
        } else {
            return res.status(response.status).json(response.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports.login = async function login(req, res) {
    try {
        const response = await axios.post('http://localhost:4329/auth/login', req.body, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        return res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
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
