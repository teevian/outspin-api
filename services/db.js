const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
  const connection = await mysql.createConnection(config.database);
  console.log("connected to the database");

  const [results, ] = await connection.execute(sql_query, params);
  console.log("executed")

  return results;
}

module.exports = {
  query
}