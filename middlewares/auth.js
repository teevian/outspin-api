const { promisify } = require('util');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const { catchAsync } = require("./catchAsync");
const ApiError = require('../utils/apiError');
const UserModel = require("../models/usersModel");

dotenv.config({ path: '../config.env' });

exports.authorize = catchAsync(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if(!token)
        return next(new ApiError("You are not logged in! Please log in to gain access", 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.id = decoded.user;

    const queryResult = await UserModel.findById(["id"], decoded.user);
    if(queryResult.length === 0)
        return next(new ApiError("You don't have an account! Please register", 401));

    res.status(200).json({ status: "success" });
});
