
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config({path : path.join(__dirname,"..",".gitignore",".env")})

const ACCESS_SIGN = process.env.ACCESS_SIGN;


const verify = (req,res,next) => {

    const header = req.headers["Authorization"] ||  req.headers["authorization"];

    if(!header){
        return res.status(400).json({err : "Token can not be empty"})
    }

    const token = header.split(" ")[1];

    jwt.verify(
        token,
        ACCESS_SIGN,
        (err,decoded) => {
            if (err) return res.status(403).json({ err: "Token is invalid" });
            req.userData = decoded;
            next();
        }
    )
    
};

module.exports = verify;