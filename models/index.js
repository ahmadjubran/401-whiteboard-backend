"use strict";

require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");
const post = require("./post.model");
const comment = require("./comment.model");
const collection = require("../collections/user-comment-routes");

const POSTGRES_URI =
  process.env.HEROKU_POSTGRESQL_MAUVE_URL || process.env.DATABASE_URL;

const sequelizeOptions = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);
const postModel = post(sequelize, DataTypes);
const commentModel = comment(sequelize, DataTypes);
const userModel = require("./user.model")(sequelize, DataTypes);

postModel.hasMany(commentModel, { foreignKey: "postId", sourceKey: "id" });
commentModel.belongsTo(postModel, { foreignKey: "postId", targetKey: "id" });

const postCollection = new collection(postModel);
const commentCollection = new collection(commentModel);

module.exports = {
  db: sequelize,
  Post: postCollection,
  Comment: commentCollection,
  CommentModel: commentModel,
  PostModel: postModel,
  UserModel: userModel,
};
