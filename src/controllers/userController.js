const { User } = require("../models");
const bcrypt = require("bcryptjs");

const makeRandomPassword = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email } = req.body;

    const password = makeRandomPassword(8);
    const hashedPassword = bcrypt.hashSync(password, 8);

    const createdUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
    });

    return res.status(200).send({
      message: "user created",
      data: createdUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).send({
      message: "success",
      data: users,
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({
        message: "user not found",
      });
    }

    if (req.user.roles !== "admin") {
      if (user.id !== req.user.id) {
        return res.status(401).send({ message: "Unauthorized request" });
      }
    }

    return res.status(200).send({
      message: "success",
      data: user,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, password, email, username, roles } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    if (user.id !== req.user.id) {
      return res.status(401).send({ message: "Unauthorized request" });
    }

    await user.update({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
      roles: roles,
    });

    return res.status(200).send({ message: "updated successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    await user.destroy();

    return res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
};
