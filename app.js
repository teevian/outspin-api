
const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const { dbConnectionCredentials } = require('./config');

const con = mysql.createConnection(dbConnectionCredentials);
con.connect((err) => {
  if(err) {
    console.log("Database Connection Error");
  }
  console.log((new Date()) + " Connected to the database");
});

exports.con = con;

const users_router = require("./routes/usersRoutes");
app.use("/users", users_router);

const club_router = require('./routes/clubsRoutes');
app.use("/clubs", club_router);

const interactionRouter = require('./routes/interactionsRoutes');
app.use("/notifications", interactionRouter);
app.use('/interactions', interactionRouter);

function closeDbConnection(con) {
  console.log("con " + con.state);
  if(con.state === 'authenticated'){
    con.end(function(err) {if(err) throw err;});
    console.log(con.state);
  }
}

exports.app = app;

