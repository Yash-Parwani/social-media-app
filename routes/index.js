const express = require("express");
//loading homecontroller
const homeController = require("../controller/home_controller");
//loading express.router

const router = express.Router();

console.log("router loaded");

//perform action when browser request for home router
router.get("/",homeController.home);
//handling all router requests for /users
//Note: here we will use .use and not .post OR .get since here we are linking another router file
router.use("/users",require("./users"));


module.exports = router;