const User = require('../models/User')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname,'..','keys', 'public.key'))

module.exports.authenticate = function authenticate(req, res, next) {

    const header = req.headers["authorization"];
  
    if (!header) {
      return next(new Error("No token sent in the request"));
    }
  
    if (!header.startsWith("Bearer ")) {
      return next(new Error("Invalid token"));
    }
  
    const token = header.substring(7);
  
    jwt.verify(token, PUBLIC_KEY, async (err, decoded) => {
      if (err) {
        return next(new Error("Token expired"));
      }
      const user = await User.findById(decoded.sub)
      req.user = user;
      next();
    });
}