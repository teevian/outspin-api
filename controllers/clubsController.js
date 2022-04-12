const mysql = require("mysql2");
const fs = require('fs');

const { getRange, distance } = require('../utils/geolocation');
const ApiError = require("../utils/apiError");
const catchAsync = require("../middlewares/catchAsyncMiddleware");


const jsonTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../models/templates/jsonTemplate.json`, 'utf-8'));
let con;
/*
exports.getClubs = (request, response) => {
    var json = jsonTemplate;
    var query = request.query;
    var id = request.query.id;
    var latitude = Number(query.latitude);
    var longitude = Number(query.longitude);
    var number = query.number;

    if (id) {
        var clubThumbnailC = clubThumbnail;

        var sql_query = mysql.format("SELECT * FROM club WHERE id = ? LIMIT 1", id);
        con.query(sql_query, (error, result, field) => {
            var length = result.length;
            var club = result[0];

            if (!length) {
                response.status(404).send({ code: 404, status: "Not Found" });
                return;
            }

            clubThumbnailC.id = club.id;
            clubThumbnailC.name = club.club_name;
            clubThumbnailC.latitude = club.latitude;
            clubThumbnailC.longitude = club.longitude;
            clubThumbnailC.burnNumber = club.burn_number;

            sql_query = mysql.format("SELECT COUNT(id) AS peopleNumber FROM user WHERE club_id = ?", id);
            con.query(sql_query, (error, result, field) => {
                if (error) throw error;

                clubThumbnailC.peopleNumber = result[0].peopleNumber;

                json.data = clubThumbnailC;
                response.status(200).json(json);
            });
        });
    } else if (latitude && longitude) {
        if (number) number = 5;

        let degToRad = Math.PI / 180;
        let range = getRange(latitude, longitude, 300);
        latitude = latitude * degToRad;
        longitude = longitude * degToRad;

        //let sql_query = mysql.format('SELECT (id, club_name, latitude, longitude, burn_number) FROM (SELECT * FROM club WHERE (latitude >= ? AND latitude <= ?)$
        //let sql_query1 = mysql.format('SELECT * FROM (SELECT * FROM club WHERE (latitude >= ? AND latitude <= ?) AND (longitude >= ? AND longitude <= ?)) AS $

        let sql_query1 = mysql.format(`SELECT * FROM club`);
        con.query(sql_query1, (error, result, field) => {
            if (error) throw error;

            let json = jsonTemplate;
            let clubList = [];
            result.forEach(function (element) {
                let clubThumbnailC = JSON.parse(JSON.stringify(clubThumbnail));

                clubThumbnailC.id = element.id;
                clubThumbnailC.name = element.club_name;
                clubThumbnailC.latitude = element.latitude;
                clubThumbnailC.longitude = element.longitude;
                clubThumbnailC.burnNumber = element.burn_number;
                clubThumbnailC.distance = distance(latitude, longitude, element.latitude * degToRad, element.longitude * degToRad);

                /*sql_query = mysql.format("SELECT COUNT(id) AS peopleNumber FROM user WHERE club_id = ?", element.id);
                con.query(sql_query, (error, result, field) => {
                    if (error) throw error;
                    clubThumbnailC.peopleNumber = result[0].peopleNumber;
                });
                clubList.push(clubThumbnailC);
          });

          clubList.sort((a, b) => {
            var distA = a.distance;
            var distB = b.distance;

            if(distA < distB) return -1;
            if(distA > distB) return 1;
            return 0;
          });

            json.data = clubList;
            response.status(200).json(json);
        });
    } else {
        response.status(404).send({ code: 404, status: "No parameters" });
    }
}
*/

exports.getClub = catchAsync(async (req, res) => {
    console.log(req.query);
    res.status(200).send();
});
