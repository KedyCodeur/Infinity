const mysql2 = require("mysql2/promise");
const path = require("path")
require("dotenv").config({path : path.join(__dirname,"..",".env")});


const pool = mysql2.createPool({
    "host" :  process.env.HOST,
    "user" :  process.env.USER,
    "password" :  process.env.PASSWORD,
    "database" :  process.env.DBNAME,
    "port" : process.env.DBPORT,
    waitForConnections: true,
    connectionLimit: 10, // Aynı anda en fazla 10 bağlantı hazır beklesin
    queueLimit: 0
});


module.exports = pool;