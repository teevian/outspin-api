
const query = require("../db/dbConnection");

const { selectQuery } = require("../db/queryConstructor");

const mysql = require('mysql2');
class UserModel {
    tableName = "user";

    findById = async (fields, id) => {
        const sqlFields = await selectQuery(fields);
        const sqlQuery = mysql.format( sqlFields + " FROM ??", [this.tableName]);
        return await query(sqlQuery + " WHERE id = ?", [id]);
    }

    findByPhone = async (fields, internationalNumber) => {
        const sqlFields = await selectQuery(fields);
        const sqlQuery = mysql.format(sqlFields + " FROM ??", [this.tableName]);
        return await query(sqlQuery + " WHERE internationalNumber = ?", [internationalNumber]);
    }
}

module.exports = new UserModel;
