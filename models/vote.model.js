"use strict";

const Vote = (sequelize, DataTypes) =>
  sequelize.define("Vote", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voteType: {
      type: DataTypes.ENUM("up", "down"),
      allowNull: false,
    },
    voteCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

module.exports = Vote;
