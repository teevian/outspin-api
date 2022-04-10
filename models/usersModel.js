const mysql = require('mysql2');

const query = require("../db/dbConnection");
const queryConstructor = require("../db/queryConstructor");

const tableName = "user";

exports.findById = async (fields, id) => {
    const sqlFields = await queryConstructor.selectQuery(fields);
    const sqlQuery = mysql.format( sqlFields + " FROM ??", [tableName]);
    return await query(sqlQuery + " WHERE id = ?", [id]);
}

exports.findByPhone = async (fields, internationalNumber) => {
    const sqlFields = await queryConstructor.selectQuery(fields);
    const sqlQuery = mysql.format(sqlFields + " FROM ??", [tableName]);
    return await query(sqlQuery + " WHERE internationalNumber = ?", [internationalNumber]);
}

