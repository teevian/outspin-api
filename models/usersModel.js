const mysql = require('mysql2');

const query = require("../db/dbConnection");
const queryConstructor = require("../db/queryConstructor");
const ApiError = require("../utils/apiError");

const tableName = "user";

exports.findOneById = async (fields, id) => {
    const sqlFields = await queryConstructor.selectQuery(fields);
    const sqlQuery = mysql.format( sqlFields + " FROM ??", [tableName]);
    return await query(sqlQuery + " WHERE id = ?", [id]);
}

exports.findOneByPhone = async (fields, internationalNumber) => {
    const sqlFields = await queryConstructor.selectQuery(fields);
    const sqlQuery = mysql.format(sqlFields + " FROM ??", [tableName]);
    return await query(sqlQuery + " WHERE internationalNumber = ?", [internationalNumber]);
}

exports.createOne = async (user) => {
    const query_schema = "INSERT INTO user (firstName, lastName, password, countryCode, phoneNumber, internationalNumber) VALUES (?,?,?,?,?,?)";
    const inserts = [ user.firstName, user.lastName, user.hashedPassword, user.countryCode, user.phoneNumber, user.internationalNumber ];
    const result = await query(query_schema, inserts);

    user = (({ firstName, lastName, countryCode, phoneNumber }) => ({  firstName, lastName, countryCode, phoneNumber }))(user) ;
    user.id = result.insertId;
    return user;
}

exports.updateOne = async (user) => {
    const userId = user.id;
    delete user.id;
    const querySchema = await queryConstructor.updateQuery(user);

    querySchema.sql = mysql.format(querySchema.sql, tableName) + " WHERE id = ?";
    querySchema.values.push(userId);
    const result = await query(querySchema.sql, querySchema.values);
    if(result.affectedRows === 0)
        throw new ApiError("Invalid id. Please register", 400);
    return;
}
