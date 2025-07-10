const mysql = require('mysql');

const connectionPool = mysql.createPool({
    host : 'localhost',
    user : 'chatApp',
    password : 'Abhinav@180602',
    database : 'chatApp'
})

module.exports = connectionPool;