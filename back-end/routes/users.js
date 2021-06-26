const express = require("express");
const {
  getProfile,
  login,
  register
} = require("../controllers/userController");
const reqAuth = require('../config/safeRoutes').reqAuth;

const router = express.Router();

router.get("/profile", reqAuth, getProfile);
router.post("/login", login);
router.post("/register", register);



module.exports = router;