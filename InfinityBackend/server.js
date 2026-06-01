const path = require("path")
const express  = require("express");
require("dotenv").config({path : path.join(__dirname,".env")});

const cors = require("cors");

const authRouter = require(path.join(__dirname,"routers","auth.js"))
const productRouter = require(path.join(__dirname,"routers","product.js"))

const jwtControllers = require(path.join(__dirname,"controllers","jwtControllers.js"))
const verifyJWT = require(path.join(__dirname,"middlewares","verifyJWT.js"))

const PORT = process.env.PORT || 3500;
const app = express();
const rateLimit = require("express-rate-limit");

whiteList = []



app.use(cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



const productLimiter = rateLimit({
    windowMs: 30 * 1000,
    max: 20, 
    message: { err: "Too many requests, try again later" }
});

const authLimiter = rateLimit({ 
    windowMs:  60 * 1000, max: 20 , 
    message: { err: "Too many requests, try again later" }
});

const refreshLimiter = rateLimit({ 
    windowMs:  60 * 1000, max: 10 , 
    message: { err: "Too many requests, try again later" }
});




app.use("/auth",authLimiter,authRouter)
app.post("/refresh",refreshLimiter,jwtControllers.refresh)


app.use("/product", productLimiter,verifyJWT, productRouter);





app.listen(PORT,()=>{
    console.log("http://localhost:" + PORT.toString());
});