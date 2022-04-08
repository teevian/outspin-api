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
}
exports.loginSchema = {
  "data.items": {
    isArray: {
      options: { min: 1, max: 1 },
    },
    errorMessage: "Send one user to login"
  },
  "data.kind": {
    equals: { options: "login" },
    errorMessage: "Template must be login kind"
  },
  "data.items.*.countryCode": {
    isLength: {
      options: { min: 1, max: 4},
      errorMessage: "Invalid country code"
    }
},
"data.items.*.phone": {
  custom: {
    options: (value, { req, location, path }) => {
      let phonePath = location + "." + path;
      let countryCodePath = phonePath.slice(0,-5) + "countryCode";
      let number = phoneUtil.parse(byString(req, countryCodePath) + byString(req, phonePath));
      return phoneUtil.isValidNumber(number);
    },
    errorMessage: "Invalid phone number"
  }
},
"data.items.*.password": {
  isLength: {
    options: { min: 9, max: 20},
    errorMessage: "Invalid password. Must have 9 to 20 characters"
  }
}
};

exports.registerSchema = {
    "data.items": {
      isArray: {
        options: { min: 1, max: 1 },
      },
      errorMessage: "Send one user to login"
    },
    "data.kind": {
      equals: { options: "register" },
      errorMessage: "Template must be register kind"
    },
    "data.items.*.countryCode": {
      isLength: {
        options: { min: 1, max: 4},
        errorMessage: "Invalid country code"
      }
    },
    "data.items.*.phone": {
      custom: {
        options: (value, { req, location, path }) => {
          let phonePath = location + "." + path;
          let countryCodePath = phonePath.slice(0,-5) + "countryCode";
          let number = phoneUtil.parse(byString(req, countryCodePath) + byString(req, phonePath));
          return phoneUtil.isValidNumber(number);
        },
        errorMessage: "Invalid phone number"
      }
    },
    "data.items.*.password": {
      isLength: {
        options: { minLength: 8, minLowerCase: 15 },
        errorMessage: "Invalid password. Must have 8 to 15 characters"
      },
      custom: {
        options: (value) => {
          return /\d/.test(value);
        },
        errorMessage: "Invalid password. Must have a number"
      }
    },
    "data.items.*.firstName": {
      isLength: {
        options: { min: 1 },
        errorMessage: "There isn't a first name"
      }
    },
    "data.items.*.lastName": {
      isLength: {
        options: { min: 1 },
        errorMessage: "There isn't a last name"
      }
    }
  };

