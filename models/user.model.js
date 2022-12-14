"use strict";

const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get: function () {
        return jwt.sign({ userName: this.userName }, process.env.JWT_SECRET);
      },
      set(tokenObj) {
        return jwt.sign(tokenObj, process.env.JWT_SECRET);
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get: function () {
        const acl = {
          admin: ["read", "create", "update", "delete"],
          user: ["read", "create"],
        };
        return acl[this.role];
      },
    },
  });

  User.authenticateToken = function (token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, validUser) => {
      if (err) {
        throw new Error("Invalid Login");
      }
      return validUser;
    });
  };

  return User;
};
