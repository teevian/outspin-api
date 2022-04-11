const fs = require('fs');
const jwt = require('jsonwebtoken');

let con;
const { hash, verify, createAccessToken, createRefreshToken, verifyRefreshToken } = require('../utils/security');
const { simpleDeepClone } = require("../utils/tools");
const catchAsync = require("../middlewares/catchAsyncMiddleware");
const userModel = require('../models/usersModel');
const query = require('../db/dbConnection');

const jsonTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../models/templates/jsonTemplate.json`, 'utf-8'));
const ApiError = require("../utils/apiError");

exports.updateUser = catchAsync( async (req, res) => {
    const user =  req.body.data.items[0];
    user.id = req.params.id;

    await userModel.updateOne(user);
    res.status(200).send();
});

exports.getUser = (req, res) => {
    const userID = req.params.id;
    const clubID = req.query.club;
    var user_thumb_attrs = ["'user' AS kind", "user.id", "user.photoURL"];

    //  " CAN'T TOUCH THIS! " - MC HAMMER, june 1990
    if (!clubID) { //  club is not specified
        let sqlQueryUserID = mysql.format(`SELECT ${user_thumb_attrs} FROM user WHERE id in (?)`, [userID]);
        con.query(sqlQueryUserID, (err, result) => {
            jsonres = jsonTemplate;
            jsonres.data.users = result;
            res.status(200).json(jsonres);
        });
        return;
    }

    if (clubID) {  // clubID is specified
        let interaction_attrs = ["'interaction' AS kind", "interaction.interactor_id", "interaction.type"];
        jsonres = jsonTemplate;
        let interactors = [];

        //  populate with interactions
        //sql_query_users_in_club = mysql.format(`SELECT ${interaction_attrs} FROM user INNER JOIN interaction ON user.id = ? AND user.id = interaction.interacted_$

        sql_query_interactions_in_club = mysql.format(`SELECT interactor_id FROM interaction WHERE interacted_id = ?`, [userID]);
        con.query(sql_query_interactions_in_club, (err, result) => {
            jsonres.data.club_id = clubID;
            interactors = result.map(item => item.interactor_id); // creates array with interactor_id's
            //  populate with other users in the same club
            sql_query_users_in_club = mysql.format(`SELECT ${user_thumb_attrs} FROM user where clubId = ?`, [clubID]);
            con.query(sql_query_users_in_club, (err, result) => {

                result.forEach((user) => {
                    user.interaction = interactors.includes(user.id) ? "wave" : "none";
                });

                jsonres.data.users = result;
                res.status(200).json(jsonres);
            });
        });
        return;
    }
};

exports.modifyUser = (req, res) => {
    const values = {
        'firstName': 'UPDATE user SET firstName = ?  WHERE id = ?',
        'lastName': 'UPDATE user SET lastName = ?  WHERE id = ?',
        'countryCode': 'UPDATE user SET countryCode = ?  WHERE id = ?',
        'phoneNumber': 'UPDATE user SET phoneNumber = ?  WHERE id = ?',
        'thumbnail': 'UPDATE user SET photoURL = ?  WHERE id = ?'
    };
    try {
        let user = req.body.data;
        let id = parseInt(req.params.id, 10);
        let modify = req.query.modify;
    } catch (error) {
        res.status(400).json({ status: "In query parameters, insert query for id and modify (property being modified)" });
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
                res.status(500).send("User modification invalid");
                return;
            } else {
                query_prepare = values[modify];
                var inserts = [user[modify], id];
                var query = mysql.format(query_prepare, inserts);

                con.query(query, function (error, result) {
                    if (error) throw error;
                    res.status(200).json({ status: "Altered successfully" });
                });
            }
        });
    });
}

exports.loginUser = catchAsync(async (req, res, next) => {
    const kind = req.body.data.kind;
    const user = req.body.data.items[0];
    user.internationalNumber = user.countryCode + user.phoneNumber;

    const result = await userModel.findOneByPhone(["id", "firstName", "lastName", "countryCode", "phoneNumber", "password"], user.internationalNumber );
    if (result.length === 0)
        return res.status(400).json({ status: "User doesn't exists" });

    const isCorrect = await verify(user.password, result[0].password);
    if (!isCorrect)
        return  res.status(400).json({ status: "Wrong password" });

    result[0].accessToken = await createAccessToken(result[0].id, "user");
    result[0].refreshToken = await createRefreshToken(result[0].id, "user");

    const jsonRes = simpleDeepClone(jsonTemplate);
    jsonRes.data.items = result;
    delete jsonRes.data.items[0].password;
    return res.status(200).json(jsonRes);
});

exports.registerUser = catchAsync(async (req, res, next) => {
    let user = req.body.data.items[0];
    user.internationalNumber =  user.countryCode + user.phoneNumber;

    user.hashedPassword = await hash(user.password)

    user = await userModel.createOne(user);
    user.accessToken = await createAccessToken(user.insertId, "user");
    user.refreshToken = await createRefreshToken(user.insertId, "user");

    const jsonres = simpleDeepClone(jsonTemplate);
    jsonres.data.items =  [ user ];
    return res.status(200).json(jsonres);
});

exports.authorization = catchAsync(async (req, res, next) => {
    const userId = req.params.id;

    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
        throw new ApiError('Token missing', 400);

    const token = req.headers.authorization.split(' ')[1];
    const tokenParams = await verifyRefreshToken(token);

    const newToken = await createAccessToken(userId, "user");
    const json = simpleDeepClone(jsonTemplate);
    json.data.items = [ { accessToken : newToken } ];
    return res.status(200).json(json);
});

exports.checkPhoneNumber = catchAsync(async (req, res, next) => {
    const result = await userModel.findOneByPhone(["id"], "+"+ req.query.countryCode + req.query.phoneNumber);
    if(result.length === 0)
        return next(new ApiError("User with the given phoneNumber doesn´t exit! Please register"));

    res.status(200).json({});
})

exports.removeUser = (req, res) => {
    res.status(200).send("DELETE METHOD user");
}

