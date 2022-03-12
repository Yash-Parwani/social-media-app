const express = require("express");

const router = express.Router();
//loading homecontroller
const homeController = require("../controller/home_controller");
//loading express.router
const postsController = require("../controller/post_controller");

console.log("router loaded");

//perform action when browser request for home router
router.get("/",homeController.home);
//handling all router requests for /users
//Note: here we will use .use and not .post OR .get since here we are linking another router file
router.use("/users",require("./users"));

// handling all router requests for /posts
router.use("/posts",require("./posts"));
//handling all router requests for /comments
router.use("/comments",require("./comments"));

//connecting routes of (i.e the index of routes of api) to the main router, so that it will know what to do when requests for api comes in
router.use("/api",require("./api/index"));

// connecting routes of likes so that all request for likes will be handled by the corresponding rotuer
router.use('/likes',require('./likes'));
module.exports = router;