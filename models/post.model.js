"use strict";

const Post = (sequelize, DataTypes) =>
  sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

module.exports = Post;
