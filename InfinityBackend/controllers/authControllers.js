
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config({path : path.join(__dirname,"..",".gitignore",".env")});

const ACCESS_SIGN = process.env.ACCESS_SIGN;
const REFRESH_SIGN = process.env.REFRESH_SIGN;

const createAccesToken = (username) => {
    
    const token = jwt.sign(
        {"username" : username},
        ACCESS_SIGN,
        {expiresIn : "300s"} //5 min
    )

    return token;
    
}

const createRefreshToken = (username) => {
    
    const token = jwt.sign(
        {"username" : username},
        REFRESH_SIGN,
        {expiresIn : "604800s"} // 7 days
    )

    return token;
    
}



const login =  async (req,res) =>{

   
    const rawData = req.body;

    const username = req.body.username;
    const password = req.body.password;


    if(!username || !password ){
       return res.status(400).json({ err: "Credentials cannot be empty" });
    }
    // c ou on va chercher l'utilisateur via son username et puis le controle 

    const passwordHashed = await bcrypt.hash("123456",10)
    
    if( !(await bcrypt.compare(password,passwordHashed) )){
        return res.status(401).json({ err: "Invalid credentials" });
    }

    const accesToken = createAccesToken();
    const refreshToken = createRefreshToken();

    return res.json({"accesToken" : accesToken , "refreshToken" : refreshToken});

}




module.exports = {login}