//router that handles all requests for posts

const express = require("express");

const router = express.Router();
//importing passport for authenticating people
const passport = require("passport");

//requiring posts controller
const postApi = require("../../../controller/api/v1/posts_api");


router.get("/",postApi.index);
// allowing only authenticated people i.e the people who created the post to delete the 
//the middle code between path and post api controller is the code that we use to check whether a person is authorized to 
router.delete('/:id',passport.authenticate('jwt',{session : false}),postApi.destroy);

module.exports = router;