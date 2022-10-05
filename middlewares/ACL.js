"use strict";

const { Post } = require("../models/index");

const acl = (capability) => {
  return async (req, res, next) => {
    try {
      let foundPost = await Post.read(req.params.id);
      if (
        req.user.capabilities.includes(capability) ||
        req.user.id === foundPost.userId
      ) {
        next();
      } else {
        next("Access Denied");
      }
    } catch (e) {
      next("Invalid Login");
    }
  };
};

module.exports = acl;
