
const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require('dotenv');

const { errorHandler } = require('./middlewares/errorHandler');
const ApiError = require('./utils/apiError');

dotenv.config({ path: './config.env' });

const con = mysql.createConnection({
	host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
     	database: process.env.DB_DATABASE
});

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

const tokensRouter = require('./routes/tokensRoutes');
app.use('/tokens', tokensRouter);

const interactionRouter = require('./routes/interactionsRoutes');
app.use("/notifications", interactionRouter);
app.use('/interactions', interactionRouter);

app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(errorHandler);

function closeDbConnection(con) {
  console.log("con " + con.state);
  if(con.state === 'authenticated'){
    con.end(function(err) {if(err) throw err;});
    console.log(con.state);
  }
}

exports.app = app;

