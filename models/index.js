"use strict";

require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");
const post = require("./post.model");
const comment = require("./comment.model");
const vote = require("./vote.model");
const user = require("./user.model");
const collection = require("../collections/post-comment-routes");

const POSTGRES_URI = process.env.HEROKU_POSTGRESQL_MAUVE_URL || process.env.DATABASE_URL;

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
const voteModel = vote(sequelize, DataTypes);
const userModel = user(sequelize, DataTypes);

userModel.hasMany(postModel, { foreignKey: "userId", sourceKey: "id" });
postModel.belongsTo(userModel, { foreignKey: "userId", targetKey: "id" });

postModel.hasMany(commentModel, { foreignKey: "postId", sourceKey: "id" });
commentModel.belongsTo(postModel, { foreignKey: "postId", targetKey: "id" });

userModel.hasMany(commentModel, { foreignKey: "userId", sourceKey: "id" });
commentModel.belongsTo(userModel, { foreignKey: "userId", targetKey: "id" });

userModel.hasMany(voteModel, { foreignKey: "userId", sourceKey: "id" });
voteModel.belongsTo(userModel, { foreignKey: "userId", targetKey: "id" });

postModel.hasMany(voteModel, { foreignKey: "postId", sourceKey: "id" });
voteModel.belongsTo(postModel, { foreignKey: "postId", targetKey: "id" });

const postCollection = new collection(postModel);
const commentCollection = new collection(commentModel);
const voteCollection = new collection(voteModel);
const userCollection = new collection(userModel);

module.exports = {
  db: sequelize,
  Post: postCollection,
  Comment: commentCollection,
  Vote: voteCollection,
  User: userCollection,
  CommentModel: commentModel,
  PostModel: postModel,
  VoteModel: voteModel,
  UserModel: userModel,
};
