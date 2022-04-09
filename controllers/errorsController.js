const fs = require('fs');

const jsonTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../models/templates/jsonTemplate.json`));

exports.errorsHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || '500';
    err.status = err.status || 'error';

    jsonResponse = JSON.parse(JSON.stringify(jsonTemplate));
    jsonResponse.data.kind = "error";
    jsonResponse.data.items = [{
        status: err.status,
        message: err.message
    }];

    if(!err.isOperational)
        console.log(err.stack);

    return res.status(err.statusCode).json(jsonResponse)
}
