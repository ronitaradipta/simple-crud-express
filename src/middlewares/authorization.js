const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.verifyToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers["authorization"];

    if (!jwtToken) {
      return res.status(403).send({
        message: "no JWT token provided",
      });
    }

    const verify = jwt.verify(jwtToken.split(" ")[1], process.env.JWT_KEY);

    if (!verify) {
      return res.status(403).send({
        message: "failed to authenticate JWT token",
      });
    }

    req.user = verify;
    next();
  } catch (error) {
    return res.status(500).send({ status: error });
  }
};

exports.verifyAdmin = async (req, res, next) => {
  try {
    const isAdmin = await User.findOne({ where: { id: req.user.id } });
    console.log(isAdmin);

    if (isAdmin.dataValues.roles !== "admin") {
      return res.status(403).send({
        message: "Forbidden, you are not allowed to do this action",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};
