const express = require("express");
const authController = require("../controllers/authController");
const validation = require("../middlewares/validators");

const router = express.Router();

router.post("/register", validation.registerValidator, authController.register);
router.post("/login", authController.login);

module.exports = router;
