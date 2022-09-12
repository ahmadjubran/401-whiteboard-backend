"use strict";

const { Sequelize, DataTypes } = require("sequelize");
const post = require("./post.model");
require("dotenv").config();

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

module.exports = {
  db: sequelize,
  Post: post(sequelize, DataTypes),
};
