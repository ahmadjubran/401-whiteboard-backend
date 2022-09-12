"use strict";

const express = require("express");
const router = express.Router();

const { Post } = require("../models/index");

router.get("/post", getPost);
router.get("/post/:id", getOnePost);
router.post("/post", createPost);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);

async function getPost(req, res) {
  let allPost = await Post.findAll();
  res.status(200).json(allPost);
}

async function getOnePost(req, res) {
  const id = req.params.id;
  let onePost = await Post.findOne({ where: { id: id } });
  res.status(200).json(onePost);
}

async function createPost(req, res) {
  let obj = req.body;
  let newPost = await Post.create(obj);
  res.status(201).json(newPost);
}

async function updatePost(req, res) {
  const id = req.params.id;
  let obj = req.body;
  let updatedPost = await Post.update(obj, { where: { id: id } });
  res.status(200).json(updatedPost);
}

async function deletePost(req, res) {
  const id = req.params.id;
  let deletedPost = await Post.destroy({ where: { id: id } });
  res.status(200).json(deletedPost);
}

module.exports = router;
