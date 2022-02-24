const express = require("express");
const { route } = require("express/lib/application");
//creating a router that will handle all requests for user
const router = express.Router();
//accessing users controller
const usersController = require("../controller/users_controller");

router.get('/profile',usersController.profile);

router.get("/sign-in",usersController.signIn);
router.get("/sign-up",usersController.signUp);
//creating a user via post request since form is via post request
router.post("/create",usersController.create);
//creating a session for user via post request
router.post("/create-session",usersController.createSession);
//exporting router handling user
module.exports = router;