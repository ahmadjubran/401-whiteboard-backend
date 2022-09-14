"use strict";

const express = require("express");
const router = express.Router();

const { Post, Comment, CommentModel } = require("../models/index");

router.get("/post", getPost);
router.get("/post/:id", getOnePost);
router.post("/post", createPost);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);

async function getPost(req, res) {
  let allPostComment = await Post.getPostComments(CommentModel);
  res.status(200).json(allPostComment);
}

async function getOnePost(req, res) {
  const id = req.params.id;
  let onePost = await Post.read(id);
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
  let foundPost = await Post.read(id);
  let updatedPost = await foundPost.update(obj);
  res.status(202).json(updatedPost);
}

async function deletePost(req, res) {
  const id = req.params.id;
  let deletedPost = await Post.delete(id);
  res.status(204).json(deletedPost);
}

module.exports = router;
