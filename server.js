const { app } =  require('./app');
const dotenv = require('dotenv');

const parses = require("./utils/parses");

dotenv.config({ path: './config.env' });

const PORT = parses.usablePort(+process.argv.slice(2));
app.listen(PORT, (err) => {
  console.log((new Date()) + " Server listening to port ");
});
