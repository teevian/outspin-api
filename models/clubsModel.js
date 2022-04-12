const mysql = require("mysql2");

const query = require("../db/dbConnection");

exports.findOneById = async (fields, id) => {
    const sqlFields = await queryConstructor.selectQuery(fields);
    const sqlQuery = mysql.format( sqlFields + " FROM ??", [tableName]);
    return await query(sqlQuery + " WHERE id = ?", [id]);
}
