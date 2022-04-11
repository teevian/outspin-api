const { promisify } = require('util');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const catchAsync = require("./catchAsyncMiddleware");
const ApiError = require('../utils/apiError');
const UserModel = require("../models/usersModel");
const { verifyAccessToken } = require('../utils/security');

dotenv.config({ path: '../config.env' });

exports.authorize = catchAsync(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if(!token)
        return next(new ApiError("You are not logged in! Please log in to gain access", 401));

    const decoded = await verifyAccessToken(token);
    req.id = decoded.id;
    req.role = decoded.role;

    switch(decoded.role) {
        case "user":
            const queryResult = await UserModel.findById(["id"], decoded.id);
            if(queryResult.length === 0)
                return next(new ApiError("You don't have an account! Please register", 401));
            break;
    }
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.role)) {
            return next(new ApiError("You do not have permission to perform this action", 403));
        }
        next();
    }
}
