

const jwt = require("jsonwebtoken");
const path = require('path');


const rootDir = process.pkg 
  ? path.dirname(process.execPath) 
  : __dirname;

require('dotenv').config({ path: path.join(rootDir, '.env') });

const db = require('../config/dbConnection.js');


const ACCESS_SIGN = process.env.ACCESS_SIGN;
const REFRESH_SIGN = process.env.REFRESH_SIGN;

const createAccessToken = (username) => {
    
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

    

    try{

       const query = "SELECT pass_word FROM sev_user WHERE BINARY  login = ?"
       
       const [userData] =  await db.execute(query,[username]);

       if(userData.length === 0) return res.status(401).json({ err: "Invalid credentials" });

       const passwordHashed = userData[0].pass_word;
       
      
       let match = password.trim() === passwordHashed.trim();
       if(!match) return res.status(401).json({ err: "Invalid credentials" });
       

       const accessToken = createAccessToken(username);
       const refreshToken = createRefreshToken(username);

       return res.json({"accessToken" : accessToken , "refreshToken" : refreshToken});


    }catch{
       return res.status(500).json({ err: "Server Error" });
        }
        
}




module.exports = {login}