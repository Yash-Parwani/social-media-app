const express = require("express");
const router = express.Router();
const passport = require("passport");
//importing postController to access actions
const postController = require("../controller/post_controller");


router.post("/create",passport.checkAuthentication,postController.create);
//get request to delete post and excepting post id as a string param
router.get("/destroy/:id",passport.checkAuthentication,postController.destroy);

module.exports = router;