"use strict";
const bcrypt = require("bcrypt");
const base64 = require("base-64");

const User = require("../models").UserModel;
const Post = require("../models").PostModel;
const Comment = require("../models").CommentModel;

const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const valid = isUserNameValid(userName);
    if (!valid) {
      return res.status(400).send("Username is not valid");
    }

    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
    };

    const user = await User.create(data);

    const output = {
      userName: user.userName,
      email: user.email,
      id: user.id,
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
  const [userName, password] = decoded.split(":");
  const user = await User.findOne({ where: { userName: userName } });

  if (user) {
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return res.status(200).json({
        User: { userName: user.userName, email: user.email, id: user.id },
        token: user.token,
      });
    } else {
      return res.status(403).send("Invalid Login");
    }
  } else {
    return res.status(403).send("Invalid Login");
  }
};

const allUser = async (req, res) => {
  const users = await User.findAll({ include: [Post, Comment] });
  res.status(200).json(users);
};

const oneUser = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    include: [Post, Comment],
  });
  res.status(200).json(user);
};

function isUserNameValid(username) {
  /* 
    Usernames can only have: 
    - Lowercase and uppercase letters
    - First character must be a letter
    - From 3 to 20 characters
    - Numbers
    - Underscores
    - Dots (.)
    - Dashes (-)
    - No spaces
  */
  const regex = username.match(/^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/);
  const valid = regex ? true : false;
  return valid;
}

module.exports = { signup, login, allUser, oneUser };
