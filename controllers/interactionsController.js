const mysql = require("mysql2");
const fs = require("fs");

let con;
const errorJSON = JSON.parse(fs.readFileSync(`${__dirname}/../models/templates/errorTemplate.json`, "utf-8"));
const jsonTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../models/templates/jsonTemplate.json`, 'utf-8'));

exports.getInteractionsByID = (request, response) => {
    const userID = request.params.id;
    console.log("listening");
    var interaction_attrs = ["'interaction' AS kind", "interaction.interactor_id", "interaction.type"];
    sql_query = mysql.format(`SELECT ${interaction_attrs} FROM interaction WHERE interacted_id = ?`, [userID]);

    con.query(sql_query, (error, result, field) => {
        if (result.length === 0) {
            response.status(400).send({ code: 404, status: "Not Found" });
            return;
        }

        jsonResponse = jsonTemplate;
        jsonResponse.data.interactions = result;
        response.status(200).json(jsonResponse);
    });
}

exports.getInteractions = (request, response) => {
    const userID = request.query.id;
    console.log("listening");
    var interaction_attrs = ["'interaction' AS kind", "interaction.interactor_id", "interaction.type"];
    sql_query = mysql.format(`SELECT ${interaction_attrs} FROM interaction WHERE interacted_id = ?`, [userID]);

    con.query(sql_query, (error, result, field) => {
        if (result.length === 0) {
            response.status(400).send({ code: 404, status: "Not Found" });
            return;
        }

        jsonResponse = jsonTemplate;
        jsonResponse.data.interactions = result;
        response.status(200).json(jsonResponse);
    });
}

exports.createInteractionByID = (request, response) => {
    let interaction = request.body.data;

      //let sql_query = mysql.format('INSERT INTO user_user_interaction (user_id_sender, user_id_receiver, interaction_type) VALUES (?, ?, ?)', [interaction.sender$
      con.query(sql_query, (error, result, field) => {
          if (error) {
              let errorTemplate = errorJSON;
              errTemplate.detail = error.sqlMessage;
              errTemplate.title = "User doesn't exist'";
              response.status(404).json(errorTemplate);
              return;
          }
          console.log(result);
          response.status(200).json(jsonTemplate);
      });
  }

  exports.createInteraction = (request, response) => {
      let interaction = request.body.data;

      //let sql_query = mysql.format('INSERT INTO user_user_interaction (user_id_sender, user_id_receiver, interaction_type) VALUES (?, ?, ?)', [interaction.sender$
      con.query(sql_query, (error, result, field) => {
          if (error) {
              let errorTemplate = errorJSON;
              errTemplate.detail = error.sqlMessage;
              errTemplate.title = "User doesn't exist'";
              response.status(404).json(errorTemplate);
              return;
          }
          console.log(result);
          response.status(200).json(jsonTemplate);
      });
  }




