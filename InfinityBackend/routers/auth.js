const path = require("path");
const express = require("express");
const authControllers = require('../controllers/authControllers.js');

const router = express.Router();



router.post("/login",authControllers.login);


module.exports = router;