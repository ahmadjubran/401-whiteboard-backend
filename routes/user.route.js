"use strict";

const { signup, allUser, login } = require("../controllers/userControllers");
const userAuth = require("../middlewares/basic-auth");
const bearerAuth = require("../middlewares/bearer-auth");

const router = require("express").Router();

router.post("/login", login);
router.post("/signup", userAuth.saveUser, signup);
router.get("/users", bearerAuth, allUser);

module.exports = router;
