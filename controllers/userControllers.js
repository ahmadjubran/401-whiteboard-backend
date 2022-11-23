"use strict";
const bcrypt = require("bcrypt");
const base64 = require("base-64");

const User = require("../models").UserModel;
const Post = require("../models").PostModel;
const Comment = require("../models").CommentModel;
const { Op } = require("sequelize");

const signup = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    if (!isUserNameValid(userName)) {
      return res.status(400).send("Username is not valid");
    }
    if (!isEmailValid(email)) {
      return res.status(400).send("Email is not valid");
    }
    if (!isPasswordValid(password)) {
      return res.status(400).send("Password is not valid");
    }

    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    };

    const user = await User.create(data);

    const output = {
      user: {
        userName: user.userName,
        email: user.email,
        id: user.id,
        role: user.role,
        capabilities: user.capabilities,
      },
      token: user.token,
    };

    if (user) {
      res.status(201).json(output);
    }
  } catch (e) {
    console.log(e);
  }
};

const login = async (req, res) => {
  const basicHeader = req.headers.authorization.split(" ");
  const decoded = base64.decode(basicHeader[1]);
  const [loginData, password] = decoded.split(":");
  const user = await User.findOne({ where: { [Op.or]: [{ userName: loginData }, { email: loginData }] } });

  if (user) {
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      const output = {
        user: {
          userName: user.userName,
          email: user.email,
          id: user.id,
          role: user.role,
          capabilities: user.capabilities,
        },
        token: user.token,
      };
      return res.status(200).json(output);
    } else {
      return res.status(403).send("Invalid Login");
    }
  } else {
    return res.status(403).send("Invalid Login");
  }
};

const allUser = async (req, res) => {
  const users = await User.findAll({ include: [Post, Comment] });

  const output = users.map((user) => {
    return {
      user: {
        userName: user.userName,
        email: user.email,
        id: user.id,
        role: user.role,
        capabilities: user.capabilities,
        Posts: user.Posts,
        Comments: user.Comments,
      },
    };
  });

  res.status(200).json(output);
};

const oneUser = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    include: [Post, Comment],
  });
  res.status(200).json(user);
};

function isUserNameValid(username) {
  const regex = username.match(/^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/);
  const valid = regex ? true : false;
  return valid;
}

function isEmailValid(email) {
  const regex = email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const valid = regex ? true : false;
  return valid;
}

function isPasswordValid(password) {
  const regex = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
  const valid = regex ? true : false;
  return valid;
}

module.exports = { signup, login, allUser, oneUser };
