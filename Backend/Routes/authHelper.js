require('dotenv').config();
const jwt = require('jsonwebtoken')

function verify_jwt(req, res, next){
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
    if (err){ return res.status(401).json({ error: 'Unauthorized' })}
    req.user = decoded
    next();
  })
}

module.exports = {verify_jwt}