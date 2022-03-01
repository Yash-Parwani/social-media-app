const express = require("express");
const router = express.Router();
const passport = require("passport");
//importing postController to access actions
const commentsController = require("../controller/comments_controller");


router.post("/create",passport.checkAuthentication,commentsController.create);
router.get("/destroy/:id",passport.checkAuthentication,commentsController.destroy);


module.exports = router;