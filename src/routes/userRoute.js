const express = require("express");
const userController = require("../controllers/userController");
const authorization = require("../middlewares/authorization");

const router = express.Router();

router.get(
  "/",
  authorization.verifyToken,
  authorization.verifyAdmin,
  userController.getUsers
);

router.get("/:id", authorization.verifyToken, userController.getUserById);

router.post(
  "/create",
  authorization.verifyToken,
  authorization.verifyAdmin,
  userController.createUser
);

router.put("/update/:id", authorization.verifyToken, userController.updateUser);

router.delete(
  "/delete/:id",
  authorization.verifyToken,
  authorization.verifyAdmin,
  userController.deleteUser
);

module.exports = router;
