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
        options: { min: 2, max: 20 },
        errorMessage: "There isn't a first name"
   }
};

const lastName = {
    isLength: {
        options: { min: 2, max: 20 },
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
        options: { min: 8, max: 15},
        errorMessage: "Invalid password. Must have 8 to 15 characters"
    }
};

const items = {
    isArray: {
        options: { min: 1, max: 1 },
    },
    errorMessage: "Send on user"
};

const optional = {
    optional: {}
}

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

exports.updateSchema = {
    "data.items": items,
    "data.items.*.firstName": { ...optional, ...firstName },
    "data.items.*.lastName": { ...optional, ...lastName },
    "data.items.*.countryCode": { ...optional, ...countryCode },
    "data.items.*.phoneNumber": { ...optional, ...phoneNumber },
    "data.items.*.password": {
        not: {},
        exists: {
            errorMessage: "Cannot change password in this path"
        }
    }
}
