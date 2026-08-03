const jwt = require("jsonwebtoken");

const path = require("path");

const { SpecialEncode } = require("../utils/loginHash");

const db = require(path.join(__dirname,"..","config","dbConnection.js"))

require("dotenv").config({path : path.join(__dirname,"..",".env")});

const ACCESS_SIGN = process.env.ACCESS_SIGN;
const REFRESH_SIGN = process.env.REFRESH_SIGN;

const createAccessToken = (username) => {
    
    const token = jwt.sign(
        {"username" : username},
        ACCESS_SIGN,
        {expiresIn : "5m"} 
    )

    return token;
    
}

const createRefreshToken = (username) => {
    
    const token = jwt.sign(
        {"username" : username},
        REFRESH_SIGN,
        {expiresIn : "7d"} 
    )

    return token;
    
}


const login =  async (req,res) =>{

   
    const username = req.body.username;
    const password = req.body.password;

    
    if(!username.trim() || !password.trim() ){
       return res.status(400).json({ err: "Credentials cannot be empty" });
    }
    // c ou on va chercher l'utilisateur via son username et puis le controle 

    try{

       const query = "SELECT pass_word FROM sev_user WHERE BINARY  login = ?"
       

       const [userData] =  await db.execute(query,[username]);

       if(userData.length === 0) return res.status(401).json({ err: "Invalid credentials" });

       const passwordHashed = userData[0].pass_word;
       
       
       const passwordEncoded = SpecialEncode.encode(password);

       let match = passwordEncoded.trim() === passwordHashed.trim();
       
       if(!match) return res.status(401).json({ err: "Invalid credentials" });
       

       const accessToken = createAccessToken(username);
       const refreshToken = createRefreshToken(username);

       return res.json({"accessToken" : accessToken , "refreshToken" : refreshToken});


    }catch{
       return res.status(500).json({ err: "Server Error" });
        }
        
}




module.exports = {login}