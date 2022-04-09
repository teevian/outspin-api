
const query = require("../db/dbConnection");

const seperateParams = async (params) => {
    if (typeof params !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(params);
    const values = Object.values(params);

    return {
        keys,
        values
    }
}

const placeHolderFields = async (size) => {
    let sqlString = "??";
    for(let i = 1; i < size; i++){
        sqlString += ",??"
    }
    return sqlString;
}

const mysql = require('mysql2');
class UserModel {
    tableName = "user";

    findById = async (fields, id) => {
        const sqlFields = await placeHolderFields(fields.length);
        const sqlQuery = mysql.format("SELECT " + sqlFields + " FROM ??", [...fields, this.tableName]);
        return query(sqlQuery + " WHERE id = ?", [id]);
    }

    findByPhone = async (fields, internationalNumber) => {
        const sqlFields = await placeHolderFields(fields.length);
        const sqlQuery = mysql.format("SELECT " + sqlFields + " FROM ??", [...fields, this.tableName]);
        return query(sqlQuery + " WHERE internationalNumber = ?", [internationalNumber]);
    }
}

module.exports = new UserModel;
