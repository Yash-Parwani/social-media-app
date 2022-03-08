//always the main router is named as index , so this is the main router that handles all requests for api i.e /api
// this is the index of routes for api requests like we have index for the main app , similarly for apis as well we will have index for routes
//this is the root index for all api routes

const express = require("express");

const router = express.Router();

//connecting router to handle v1 requests

router.use("/v1",require("./v1/index"));

module.exports = router;