const express = require("express");
//creating a router that will handle all requests for user
const router = express.Router();
//accessing users controller
const usersController = require("../controller/users_controller");
const passport = require("passport");
//passport.checkauthentication checks if user is authenticated to access a particular route
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);

router.get("/sign-in",usersController.signIn);
router.get("/sign-up",usersController.signUp);
//creating a user via post request since form is via post request
router.post("/create",usersController.create);

//router to signout
router.get("/sign-out",usersController.destroySession);
//router for creating a session
//using passport as a middleware to authenticate
//passport.authenticate uses the code that we had written in passport-local-strategy in config folder
//this passport.authenticate along with fields has to be done only once when we want to create a session
router.post("/create-session",passport.authenticate(
    'local',
    {failureRedirect:"/users/sign-in"}) , usersController.createSession);
  

//exporting router handling user
module.exports = router;