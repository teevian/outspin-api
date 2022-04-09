const { app } =  require('./app');

const parses = require("./utils/parses");

process.on("uncaughtException", err => {
    console.log("UNCAUGHT EXCEPTION. Shutting down");
    console.log(err.name, err.message);
    process.exit(1);
});

const PORT = parses.usablePort(+process.argv.slice(2));
console.log(PORT);
const server = app.listen(PORT, (err) => {
  console.log((new Date()) + " Server listening to port ");
});
process.on("unhandledRejection", err => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION. Shutting down");
    server.close(() => {
        process.exit(1);
    });
});

