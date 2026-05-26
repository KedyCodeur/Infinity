const path = require("path");
const express = require("express");
const authControllers = require(path.join(__dirname,"..","controllers","authControllers.js"));

const router = express.Router();



router.post("/login",authControllers.login);


module.exports = router;