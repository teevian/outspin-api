const crypto = require('crypto');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { promisify } = require("util");

dotenv.config({ path: '../config.env' });


exports.hash = function hash(password) {
    return bcrypt.hash(password, 12);
}

exports.verify = function verify(password, hash) {
    return bcrypt.compare(password,hash);
}

exports.createAccessToken = (id, role) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.JWT_ACCESS_SECRET;
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

exports.createRefreshToken = (id, role) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.JWT_REFRESH_SECRET;
        const token = jwt.sign(
            {
                id: id,
                role: role
            },
            secret,
            {
                expiresIn: '365d'
            }
        );
        resolve(token);
    });
}

exports.verifyAccessToken = async (token) => {
    return await promisify(jwt.verify)(token, process.env.JWT_ACCESS_SECRET);
}

exports.verifyRefreshToken = async (token) => {
    return await promisify(jwt.verify)(token, process.env.JWT_REFRESH_SECRET);
}
