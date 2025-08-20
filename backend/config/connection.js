const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();


const connectionPool = mysql.createPool({
    host : process.env.HOST_NAME,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
})

module.exports = connectionPool;