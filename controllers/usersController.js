const fs = require('fs');
const jwt = require('jsonwebtoken');

let con;
const { hash, verify, createAccessToken, createRefreshToken, verifyRefreshToken } = require('../utils/security');
const catchAsync = require("../middlewares/catchAsyncMiddleware");
const userModel = require('../models/usersModel');
const query = require('../db/dbConnection');

const jsonTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../models/templates/jsonTemplate.json`, 'utf-8'));
const ApiError = require("../utils/apiError");


exports.getUser = (request, response) => {
    const userID = request.params.id;
    const clubID = request.query.club;
    var user_thumb_attrs = ["'user' AS kind", "user.id", "user.photoURL"];

    //  " CAN'T TOUCH THIS! " - MC HAMMER, june 1990
    if (!clubID) { //  club is not specified
        let sqlQueryUserID = mysql.format(`SELECT ${user_thumb_attrs} FROM user WHERE id in (?)`, [userID]);
        con.query(sqlQueryUserID, (err, result) => {
            jsonResponse = jsonTemplate;
            jsonResponse.data.users = result;
            response.status(200).json(jsonResponse);
        });
        return;
    }

    if (clubID) {  // clubID is specified
        let interaction_attrs = ["'interaction' AS kind", "interaction.interactor_id", "interaction.type"];
        jsonResponse = jsonTemplate;
        let interactors = [];

        //  populate with interactions
        //sql_query_users_in_club = mysql.format(`SELECT ${interaction_attrs} FROM user INNER JOIN interaction ON user.id = ? AND user.id = interaction.interacted_$

        sql_query_interactions_in_club = mysql.format(`SELECT interactor_id FROM interaction WHERE interacted_id = ?`, [userID]);
        con.query(sql_query_interactions_in_club, (err, result) => {
            jsonResponse.data.club_id = clubID;
            interactors = result.map(item => item.interactor_id); // creates array with interactor_id's
            //  populate with other users in the same club
            sql_query_users_in_club = mysql.format(`SELECT ${user_thumb_attrs} FROM user where clubId = ?`, [clubID]);
            con.query(sql_query_users_in_club, (err, result) => {

                result.forEach((user) => {
                    user.interaction = interactors.includes(user.id) ? "wave" : "none";
                });

                jsonResponse.data.users = result;
                response.status(200).json(jsonResponse);
            });
        });
        return;
    }
};

exports.modifyUser = (request, response) => {
    const values = {
        'firstName': 'UPDATE user SET firstName = ?  WHERE id = ?',
        'lastName': 'UPDATE user SET lastName = ?  WHERE id = ?',
        'countryCode': 'UPDATE user SET countryCode = ?  WHERE id = ?',
        'phoneNumber': 'UPDATE user SET phoneNumber = ?  WHERE id = ?',
        'thumbnail': 'UPDATE user SET photoURL = ?  WHERE id = ?'
    };
    try {
        let user = request.body.data;
        let id = parseInt(request.params.id, 10);
        let modify = request.query.modify;
    } catch (error) {
        response.status(400).json({ status: "In query parameters, insert query for id and modify (property being modified)" });
        return;
    }
    con.connect(function (err) {
        if (err) throw err;
        var query_prepare = "SELECT password FROM user WHERE id = ? LIMIT 1";
        con.query(query_prepare, id, function (error, result) {
            if (error)
                throw error;
            else if (result[0].password != user.password || !(modify in values)) {
                console.log("User modification invalid");
                response.status(500).send("User modification invalid");
                return;
            } else {
                query_prepare = values[modify];
                var inserts = [user[modify], id];
                var query = mysql.format(query_prepare, inserts);

                con.query(query, function (error, result) {
                    if (error) throw error;
                    response.status(200).json({ status: "Altered successfully" });
                });
            }
        });
    });
}

exports.loginUser = catchAsync(async (request, response, next) => {
    const kind = request.body.data.kind;
    const user = request.body.data.items[0];
    user.internationalNumber = user.countryCode + user.phoneNumber;

    const result = await userModel.findByPhone(["id", "firstName", "lastName", "countryCode", "phoneNumber", "password"], user.internationalNumber );
    if (result.length === 0)
        return response.status(400).json({ status: "User doesn't exists" });

    const isCorrect = await verify(user.password, result[0].password);
    if (!isCorrect)
        return  response.status(400).json({ status: "Wrong password" });

    result[0].accessToken = await createAccessToken(result[0].id, "user");
    result[0].refreshToken = await createRefreshToken(result[0].id, "user");

    const jsonResponse = JSON.parse(JSON.stringify(jsonTemplate));
    jsonResponse.data.items = result;
    delete jsonResponse.data.items[0].password;
    return response.status(200).json(jsonResponse);
});

exports.registerUser = catchAsync(async (request, response, next) => {
    const user = request.body.data.items[0];
    user.internationalNumber =  user.countryCode + user.phoneNumber;

    const hashedPassword = await hash(user.password)

    const query_schema = "INSERT INTO user (firstName, lastName, password, countryCode, phoneNumber, internationalNumber) VALUES (?,?,?,?,?,?)";
    const inserts = [ user.firstName, user.lastName, hashedPassword, user.countryCode, user.phoneNumber, user.internationalNumber ];
    const result = await query(query_schema, inserts);

    const userR = {};
    userR.id = result.insertId; userR.firstName = user.firstName; userR.lastName = user.lastName; userR.countryCoode = user.countryCode; userR.phoneNumber = user.phoneNumber;
    userR.accessToken = await createAccessToken(result.insertId, "user");
    userR.refreshToken = await createRefreshToken(result.insertId, "user");

    const jsonResponse = JSON.parse(JSON.stringify(jsonTemplate));
    jsonResponse.data.items =  [ userR ];
    return response.status(200).json(jsonResponse);
});

exports.authorization = catchAsync(async (request, response, next) => {
    const userId = request.params.id;

    if(!request.headers.authorization || !request.headers.authorization.startsWith('Bearer'))
        throw new ApiError('Token missing', 400);

    const token = request.headers.authorization.split(' ')[1];
    const tokenParams = await verifyRefreshToken(token);
    console.log(tokenParams);

    const newToken = await createAccessToken(userId, "user");
    const json = JSON.parse(JSON.stringify(jsonTemplate));
    json.data.items = [ { accessToken : newToken } ];
    return response.status(200).json(json);
});

exports.checkPhoneNumber = catchAsync(async (req, res, next) => {
    const result = await userModel.findByPhone(["id"], "+"+ req.query.countryCode.replace(/['"]+/g, '') + req.query.phoneNumber.replace(/['"]+/g, ''));
    if(result.length === 0)
        return next(new ApiError("User with the given phoneNumber doesn´t exit! Please register"));

    res.status(200).json({});
})

exports.removeUser = (request, response) => {
    response.status(200).send("DELETE METHOD user");
}

