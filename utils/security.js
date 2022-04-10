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

exports.createToken = function createToken(id, role) {
    return new Promise((resolve, reject) => {
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                id: id,
                role: role
            },
            secret,
            {
                expiresIn: '1d'
            }
        );
        resolve(token);
    });
}
