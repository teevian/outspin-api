const db = require("./db");
const config = require("../config");
const utils = require("../utils/parses");

async function getUsers() {
  console.log("dsa");
  const rows = await db.query_sql("SELECT * FROM user");
//  const data = utils.clearEmptyRows(rows);

  return rows;
}

module.exports = {
  getUsers
}