//router that handles all requests for posts

const express = require("express");

const router = express.Router();

//requiring posts controller
const postApi = require("../../../controller/api/v1/posts_api");


router.get("/",postApi.index);
router.delete('/:id',postApi.destroy);

module.exports = router;