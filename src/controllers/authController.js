const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    const registeredUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
    });

    return res.status(200).send({
      message: "user registered successfully",
      result: registeredUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const getUser = await User.findOne({ where: { email: email } });

    if (getUser) {
      const comparedPassword = bcrypt.compareSync(
        password,
        getUser.dataValues.password
      );
      if (!comparedPassword) {
        return res.status(400).send({
          message: "Invalid password",
        });
      } else {
        const token = jwt.sign(
          {
            id: getUser.dataValues.id,
            email: getUser.dataValues.email,
            username: getUser.dataValues.username,
            roles: getUser.dataValues.roles,
          },
          process.env.JWT_KEY,
          { expiresIn: 3600 }
        );
        return res.status(200).send({
          message: "login successful",
          data: {
            username: getUser.dataValues.username,
            email: getUser.dataValues.email,
            token: token,
          },
        });
      }
    } else {
      return res.status(404).send({
        message: "invalid email",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error,
    });
  }
};
