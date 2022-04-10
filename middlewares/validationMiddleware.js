const { validationResult } = require('express-validator');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const { byString } = require('../utils/tools');
const ApiError = require('../utils/apiError');


exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const msg =  errors.array()[0].msg;
        next(new ApiError(msg,404));
  }
    next();
}

const firstName = {
    isLength: {
        options: { min: 1, max: 15 },
        errorMessage: "There isn't a first name"
    }
};

const lastName = {
    isLength: {
        options: { min: 1, max: 15 },
        errorMessage: "There isn't a last name"
    }
};

const countryCode = {
    isLength: {
        options: { min: 1, max: 3},
        errorMessage: "Invalid country code",
    }
};

const phoneNumber = {
    custom: {
        options: (value, { req, location, path }) => {
            let phonePath = location + "." + path;
            let countryCodePath = phonePath.slice(0,-11) + "countryCode";
            let number = phoneUtil.parse("+"+ byString(req, countryCodePath) + byString(req, phonePath));
            return phoneUtil.isValidNumber(number);
        },
        errorMessage: "Invalid phone number"
    }
};

const password = {
    isLength: {
        options: { min: 9, max: 20},
        errorMessage: "Invalid password. Must have 9 to 20 characters"
    }
};

const items = {
    isArray: {
        options: { min: 1, max: 1 },
    },
    errorMessage: "Send one user to login"
};

exports.loginSchema = {
    "data.items": items,
    "data.items.*.countryCode": countryCode,
    "data.items.*.phoneNumber": phoneNumber,
    "data.items.*.password": password,
}

exports.registerSchema = {
    "data.items": items,
    "data.items.*.firstName": firstName,
    "data.items.*.lastName": lastName,
    "data.items.*.countryCode": countryCode,
    "data.items.*.phoneNumber": phoneNumber,
    "data.items.*.password": password,
}

