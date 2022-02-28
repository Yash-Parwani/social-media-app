const express = require("express");
const router = express.Router();
const passport = require("passport");
//importing postController to access actions
const commentsController = require("../controller/comments_controller");


router.post("/create",passport.checkAuthentication,commentsController.create);


module.exports = router;