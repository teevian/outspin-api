
const express = require("express");
const app = express();
const dotenv = require('dotenv');

const { errorsHandler } = require('./controllers/errorsController');
const ApiError = require('./utils/apiError');

dotenv.config({ path: './config.env' });

const users_router = require("./routes/usersRoutes");
app.use("/users", users_router);

const club_router = require('./routes/clubsRoutes');
app.use("/clubs", club_router);

const interactionRouter = require('./routes/interactionsRoutes');
app.use("/notifications", interactionRouter);
app.use('/interactions', interactionRouter);

app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(errorsHandler);

function closeDbConnection(con) {
  console.log("con " + con.state);
  if(con.state === 'authenticated'){
    con.end(function(err) {if(err) throw err;});
    console.log(con.state);
  }
}

exports.app = app;

