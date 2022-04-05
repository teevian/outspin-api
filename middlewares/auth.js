const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({ path: '../config.env' });

exports.authorize = function authorize(req, res, next) {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token) {
    res.status(400).json({ error : "Not authorized" });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error : "Not authorized" });
  }
}
