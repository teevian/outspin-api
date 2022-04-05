const mysql = require("mysql2");
const fs = require('fs');
const jwt = require('jsonwebtoken');

const { con } = require('../app');
const { hash, verify } = require('../utils/hash');
const { authorize } = require("../middlewares/auth");

const jsonTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../routes/json_template.json`, 'utf-8'));
const userThumbnailJSON = JSON.parse(fs.readFileSync(`${__dirname}/../routes/user_thumbnail.json`, 'utf-8'));
const getUsersInsideJSON = JSON.parse(fs.readFileSync(`${__dirname}/../routes/get_users_inside.json`, 'utf-8'));

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

const jsonTemplate1 = JSON.parse(fs.readFileSync(`${__dirname}/../models/json_template.json`, 'utf-8'));
exports.loginUser = (request, response) => {
  let kind = request.body.data.kind;
  let user = request.body.data.items[0];
  let query = mysql.format("SELECT id, firstName, lastName, password, photoURL FROM user WHERE user.phoneNumber = ? LIMIT 1", user.phone);
  con.query(query, (error, result) => {
    if (error) throw error;
    if (result.length === 0) {
      response.status(400).json({ status: "User doesn't exists" });
      return;
    }
    verify(user.password, result[0].password).then((value) => {
      if (value) {
        let jsonResponse = JSON.parse(JSON.stringify(jsonTemplate1));
        jsonResponse.data.items = result;
        jsonResponse.data.kind = "user";
        response.status(200).json(jsonResponse);
      } else {
        response.status(400).json({ status: "Wrong password" });
      }
    });
  });
}

exports.registerUser = (request, response) => {
  let user = request.body.data.items[0];

  hash(user.password).then((hashedPassword) => {
    let query_schema = "INSERT INTO user (firstName, lastName, password, countryCode, phoneNumber) VALUES (?,?,?,?,?)";
    let inserts = [ user.firstName, user.lastName, hashedPassword, user.countryCode, user.phone ];

    let query_sql = mysql.format(query_schema, inserts);
    con.query(query_sql, (err, result) => { 
        if(err) throw err;
        let jsonResponse = JSON.parse(JSON.stringify(jsonTemplate1));
        user.password = hashedPassword.split(":")[1];
        const token = jwt.sign({ id: result.insertId }, jwt_secret, {
          expiresIn: "1d"
        });
        user.token = token;
  
        jsonResponse.data.items[0] = user; 
        response.status(200).json(jsonResponse);
      });
    })
  }
  
  exports.removeUser = (request, response) => {
    response.status(200).send("DELETE METHOD user");
  }
  
