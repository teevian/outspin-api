const mysql = require('mysql2');

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
exports.whereQuery = async (params) => {
    const paramsArray = await seperateParams(params);
    const string = " ?? = ?";

    let sql = " WHERE" + mysql.format(string, paramsArray.keys[0]);
    for(let i = 1; i < paramsArray.keys.length; ++i)
        sql += " AND" + mysql.format(string, paramsArray.keys[i])
    return { sql, values: paramsArray.values };
}

exports.insertQuery = async (params) => {
    const paramsArray = await seperateParams(params);

    let sql = "INSERT INTO ?? (" + mysql.format("??", paramsArray.keys[0]);
    let sql2 = "VALUES (?";
    for(let i = 1; i < paramsArray.keys.length; ++i) {
        sql += mysql.format(",??", paramsArray.keys[i]);
        sql2 += ",?";
    }
    sql += ") " + sql2 + ")";
    return { sql, values: paramsArray.values };
}

exports.selectQuery = async (fields) => {
    let sql = "SELECT " + mysql.format("??", fields[0]);
    for(let i = 1; i < fields.length; ++i)
        sql += mysql.format(",??", fields[i]);
    return sql;
}

exports.updateQuery = async (params) => {
    console.log(params);
    const paramsArray = await seperateParams(params);

    let sql = "UPDATE ?? SET " + mysql.format("?? = ?", paramsArray.keys[0]);
    for(let i = 1; i < paramsArray.keys.length; ++i)
        sql += mysql.format(", ?? = ?", paramsArray.keys[i]);

    return { sql, values: paramsArray.values };
}
