"use strict";

const User = require("../models").UserModel;

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next("Invalid Login");
  } else {
    const token = req.headers.authorization.split(" ").pop();

    try {
      const validUser = await User.authenticateToken(token);
      const user = await User.findOne({
        where: { userName: validUser.userName },
      });

      if (user) {
        req.user = user;
        req.token = user.token;

        next();
      } else {
        next("Invalid Login");
      }
    } catch (e) {
      console.log(e);
    }
  }
};
