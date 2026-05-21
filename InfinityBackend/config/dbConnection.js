const mysql2 = require("mysql2/promise");
const path = require("path")
require("dotenv").config({path : path.join(__dirname,"..",".gitignore",".env")});


const pool = mysql2.createPool({
    "host" :  process.env.HOST,
    "user" :  process.env.USER,
    "password" :  process.env.PASSWORD,
    "database" :  process.env.DBNAME,
    "port" : process.env.DBPORT
})
console.log("Bağlanmaya çalışılan IP:", process.env.HOST);
const test = async () => {
    await pool.getConnection()
    console.log("okey")
}
test();
module.exports = pool;