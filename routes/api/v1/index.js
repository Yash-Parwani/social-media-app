//always the main router is named as index , so this is the main router that handles all requests for v1 version of api i.e /api/v1
// this is the index of routes for api v1 like we have index for the main app , similarly for apis as well we will have index for routes
//i.e this is the root index for v1 routes
const express = require("express");

const router = express.Router();


router.use("/posts",require("./posts"));
router.use("/users",require("./users"));
module.exports = router;