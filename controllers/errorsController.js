const fs = require('fs');

const jsonTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../models/templates/jsonTemplate.json`));

const sendErrorDev = (err, res) => {
    jsonResponse = JSON.parse(JSON.stringify(jsonTemplate));
    jsonResponse.data.kind = "error";
    jsonResponse.data.items = [{
        status: err.status,
        error: err,
        message: err.message,
        stach: err.stack
    }];
    return res.status(err.statusCode).json(jsonResponse);
}

const sendErrorProd = (err, res) => {
    jsonResponse = JSON.parse(JSON.stringify(jsonTemplate));
    jsonResponse.data.kind = "error";

    if(err.isOperational) {
        jsonResponse.data.items = [{
            status: err.status,
            message: err.message,
        }];
    }else {
        jsonResponse.data.items = [{
            status: err.status,
            message: "The server exploded",
        }];
    }

       return res.status(err.statusCode).json(jsonResponse);
}

exports.errorsHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || '500';
    err.status = err.status || 'error';

    if(!err.isOperational)
        console.log(err);
    if(process.env.NODE_ENV === "development")
        return sendErrorDev(err,res);
    else if(process.env.NODE_ENV === "production")
        return sendErrorProd(err,res);
}
