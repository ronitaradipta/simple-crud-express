const validator = require("validator");
const {} = require("../models");

exports.registerValidator = async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName && !lastName && !username && !password && !email) {
    return res.status(400).send({
      message: "field should not be empty",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send({
      message: "invalid email address",
    });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).send({
      message:
        "Password not strong. Password must be at least 8 characters long, must containt Uppercase and lowercase letters, number and unique character",
    });
  }

  next();
};
