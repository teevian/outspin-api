const { app } =  require('./app');

const parses = require("./utils/parses");

const PORT = parses.usablePort(+process.argv.slice(2));
console.log(PORT);
app.listen(PORT, (err) => {
  console.log((new Date()) + " Server listening to port ");
});
