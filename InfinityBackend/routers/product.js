const express = require("express");
const path = require("path");
const productModels = require(path.join(__dirname,"..","models","productModels.js"));

const router = express.Router();


router.post("/createLabel",productModels.getProductByCodeBare)
router.put("/quantityChange",productModels.changeProductQuantity)
router.post("/priceChange",productModels.changeProductPrice)
router.post("/findProduct", productModels.findProduct);
module.exports = router ;