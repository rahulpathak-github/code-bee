const express = require("express");
const {
  getProfile,
  login,
  register,
  logout,
  confirmMail,
  forgotPassword,
  resetPassword
} = require("../controllers/userController");
const reqAuth = require('../config/safeRoutes').reqAuth;

const router = express.Router();

router.get("/profile", reqAuth, getProfile);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", reqAuth, logout)
router.get("/confirm/:id", confirmMail)
router.post("/forgotpassword", forgotPassword)
router.post('/resetpass/:id', resetPassword)



module.exports = router;




