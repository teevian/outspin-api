const jwt = require('jsonwebtoken');
const fs = require('fs');

const { createToken } = require('../utils/security');
const query = require('../db/dbConnection');

const jsonTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../models/templates/jsonTemplate.json`, 'utf-8'));

exports.authorization = async (request, response, next) => {
    const userId = request.params.id;

    if(!request.headers.authorization || !request.headers.authorization.startsWith('Bearer'))
        return response.status(400).json({ error :  "Not a authorized" });

    const token = request.headers.authorization.split(' ')[1];
    const result =  await query('SELECT (token) FROM user WHERE id = ? LIMIT 1', [userId]);
    if(token != result[0].token)
        return response.status(400).json({ error :  "Not authorized" });
    const newToken = await createToken(userId);

    const json = JSON.parse(JSON.stringify(jsonTemplate));
    json.data.items = [ { token : newToken } ];
    return response.status(200).json(json);
}

