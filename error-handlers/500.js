"use strict";

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: "Server Error",
    code: 500,
  });
};

module.exports = errorHandler;
