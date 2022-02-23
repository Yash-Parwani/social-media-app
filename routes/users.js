const express = require("express");
//creating a router that will handle all requests for user
const router = express.Router();
//accessing users controller
const usersController = require("../controller/users_controller");

router.get('/profile',usersController.profile);

//exporting router handling user
module.exports = router;