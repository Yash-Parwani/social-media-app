const express = require("express");

const router = express.Router();

// importing likes_controller

const likesController = require("../controller/likes_controller");

router.post('/toggle',likesController.toggleLike)

module.exports = router;