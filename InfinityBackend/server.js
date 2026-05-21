const path = require("path")
const express  = require("express");
require("dotenv").config({path : path.join(__dirname,".gitignore",".env")});

const cors = require("cors");

const authRouter = require(path.join(__dirname,"routers","auth.js"))


const jwtControllers = require(path.join(__dirname,"controllers","jwtControllers.js"))
const verifyJWT = require(path.join(__dirname,"middlewares","verifyJWT.js"))

const PORT = process.env.PORT || 3500;
const app = express();

whiteList = []

app.use(cors(
    corsOption = {
        origin : (origin,callback) => {
            
            if(!origin || whiteList.indexOf(origin) !== -1){
                callback(null,true)
            }else{
                callback( new Error ("Connexion Pas Autorisé"))
            }   
        }

    }
    
))

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));




app.use("/auth",authRouter)
app.use("/refresh",jwtControllers.refresh)

app.use("/",(req,res,next) => verifyJWT(req,res,next));

app.get("/",(req,res) => {
    res.json({a : "oldu"})
})





app.listen(PORT,()=>{
    console.log("http://localhost:" + PORT.toString());
});