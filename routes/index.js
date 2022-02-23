const express = require("express");
//loading homecontroller
const homeController = require("../controller/home_controller");
//loading express.router

const router = express.Router();
console.log("router loaded");

//perform action when browser request for home router
router.get("/",homeController.home);


module.exports = router;