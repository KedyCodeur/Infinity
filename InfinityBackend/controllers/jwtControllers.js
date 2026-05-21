
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config({path : path.join(__dirname,"..",".gitignore",".env")})

const ACCESS_SIGN = process.env.ACCESS_SIGN;
const REFRESH_SIGN = process.env.REFRESH_SIGN;


const refresh = (req,res) => {

    const data = req.body;

    const refreshToken = req.body.refreshToken;

    if(!refreshToken) return res.status(400).json({err : "Refresh Token can not be empty"});

    jwt.verify(
        refreshToken,
        REFRESH_SIGN,
        (err,decode) => {
            if (err) return res.status(403).json({err : "Refresh Token is invalid"})
                const username = decode.username;
                
                const accesToken = jwt.sign(
                    {"username" : username},
                    ACCESS_SIGN,
                    {expiresIn : "300s"}
                )

                res.json({"accesToken" : accesToken})

        }
    )

};

module.exports = {refresh}