"use strict";

const Comment = (sequelize, DataTypes) =>
  sequelize.define("Comment", {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

module.exports = Comment;
