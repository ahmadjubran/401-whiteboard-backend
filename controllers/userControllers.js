"use strict";
const bcrypt = require("bcrypt");
const base64 = require("base-64");

const User = require("../models").UserModel;

const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
    };

    const user = await User.create(data);

    if (user) {
      res.status(201).json(user);
    }
  } catch (e) {
    console.log(e);
  }
};

const login = async (req, res) => {
  const basicHeader = req.headers.authorization.split(" ");
  const decoded = base64.decode(basicHeader[1]);
  const [userName, password] = decoded.split(":");
  const user = await User.findOne({ where: { userName: userName } });

  if (user) {
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      res.status(200).json(user);
    } else {
      res.status(403).send("Invalid Login");
    }
  } else {
    res.status(403).send("Invalid Login");
  }
};

const allUser = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
};

module.exports = { signup, allUser, login };
