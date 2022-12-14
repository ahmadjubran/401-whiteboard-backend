"use strict";

const express = require("express");
const router = express.Router();

const { Post, CommentModel, UserModel, VoteModel } = require("../models/index");
const bearerAuth = require("../middlewares/bearer-auth");
const acl = require("../middlewares/ACL");

router.get("/post", bearerAuth, acl("read"), getPost);
router.get("/post/:id", bearerAuth, acl("read"), getOnePost);
router.get("/post/user/:id", bearerAuth, acl("read"), getPostByUser);
router.post("/post/:userId", bearerAuth, acl("create"), createPost);
router.put("/post/:id", bearerAuth, acl("update"), updatePost);
router.delete("/post/:id", bearerAuth, acl("delete"), deletePost);

async function getPost(req, res) {
  let allPost = await Post.getPostComments(UserModel, CommentModel, VoteModel);
  res.status(200).json(allPost);
}

async function getOnePost(req, res) {
  const id = req.params.id;
  let onePost = await Post.getPostComments(UserModel, CommentModel, voteModel, id);
  res.status(200).json(onePost);
}

async function getPostByUser(req, res) {
  const id = req.params.id;
  let userPost = await Post.getPostCommentsByUserId(id, CommentModel);
  res.status(200).json(userPost);
}

async function createPost(req, res) {
  const userId = req.params.userId;
  let obj = req.body;
  obj.userId = userId;
  let newPost = await Post.createPost(obj, UserModel, CommentModel, VoteModel);
  res.status(201).json(newPost);
}

async function updatePost(req, res) {
  const id = req.params.id;
  let obj = req.body;
  let updatedPost = await Post.updatePost(id, obj, UserModel, CommentModel, VoteModel);
  res.status(202).json(updatedPost);
}
async function deletePost(req, res) {
  const id = req.params.id;
  let deletedPost = await Post.delete(id);
  res.status(204).send("Post Deleted");
}

module.exports = router;
