const { jwt_secret } = require('../config');
const jwt = require('jsonwebtoken');

exports.authorize = function authorize(req, res, next) {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token) {
    res.status(400).json({ error : "Not authorized" });
  }

  try{
    const decoded = jwt.verify(token, jwt_secret);
    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error : "Not authorized" });
  }
}