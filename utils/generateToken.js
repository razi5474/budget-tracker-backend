const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (id)=>{
  return jwt.sign({id},process.env.JWT_SECRET_KEY,{
    expiresIn:maxAge
  })
}

module.exports = {createToken}