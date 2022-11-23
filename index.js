"use strict";

require("dotenv").config();
const server = require("./server");
const { db } = require("./models/index");

db.sync({ force: false })
  .then(() => {
    server.start(process.env.PORT || 3003);
  })
  .catch(console.error);
