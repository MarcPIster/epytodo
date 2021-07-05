const env = require('dotenv').config();
const mysql = require('mysql2');

const db = process.env.MYSQL_DATABASE;
const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_ROOT_PASSWORD;

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db
});

connection.connect();
module.exports = { connection };