const path = require("path");
const express = require("express");
const authControllers = require(path.join(__dirname,"..","controllers","authControllers.js"));

const router = express.Router();

const test = (req,res) => {
    res.json("çalıştı");
}

router.post("/login",authControllers.login);
router.post("/register",test);

module.exports = router;