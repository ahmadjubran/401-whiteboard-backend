"use strict";

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: "Not Found",
    code: 404,
  });
};

module.exports = notFoundHandler;
