const crypto = require('crypto');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({ path: '../config.env' });


exports.hash = function hash(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(8).toString("hex")

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}

exports.verify = function verify(password, hash) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
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
