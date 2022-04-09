const crypto = require('crypto');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

dotenv.config({ path: '../config.env' });


exports.hash = function hash(password) {
    return bcrypt.hash(password, 12);
}

exports.verify = function verify(password, hash) {
    return bcrypt.compare(password,hash);
}

exports.createToken = function createToken(userId) {
    return new Promise((resolve, reject) => {
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                user: userId
            },
            secret,
            {
                expiresIn: '1d'
            }
        );
        resolve(token);
    });
}
