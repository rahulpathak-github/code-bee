const express = require("express");
const { getComments } = require('../controllers/Comment');

const router = express.Router();


router.get("/getAllComments/:courseItem_id", getComments);

module.exports = router;