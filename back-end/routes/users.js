const express = require("express");
const {
  getProfile,
  login,
  register,
  logout
} = require("../controllers/userController");
const reqAuth = require('../config/safeRoutes').reqAuth;

const router = express.Router();

router.get("/profile", reqAuth, getProfile);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", reqAuth, logout)



module.exports = router;