"use strict";

const { Post } = require("../models/index");

const acl = (capability) => {
  return async (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      } else if (req.params.id) {
        const post = await Post.read(req.params.id);
        post.userId === req.user.id ? next() : next("Access Denied");
      } else {
        next("Access Denied");
      }
    } catch (e) {
      next("Invalid Login");
    }
  };
};

module.exports = acl;
