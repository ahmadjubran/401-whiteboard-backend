"use strict";

const express = require("express");
const router = express.Router();

const { Comment } = require("../models/index");

router.get("/comment", getComments);
router.get("/comment/:id", getComment);
router.post("/comment/:id", createComment);
router.put("/comment/:id", updateComment);
router.delete("/comment/:id", deleteComment);

async function getComments(req, res) {
  let allComment = await Comment.read();
  res.status(200).json(allComment);
}

async function getComment(req, res) {
  const id = req.params.id;
  let oneComment = await Comment.read(id);
  res.status(200).json(oneComment);
}

async function createComment(req, res) {
  const id = req.params.id;
  let obj = req.body;
  obj.postId = id;
  let newComment = await Comment.create(obj);
  res.status(201).json(newComment);
}

async function updateComment(req, res) {
  const id = req.params.id;
  let obj = req.body;
  let foundComment = await Comment.read(id);
  let updatedComment = await foundComment.update(obj);
  res.status(202).json(updatedComment);
}

async function deleteComment(req, res) {
  const id = req.params.id;
  let deletedComment = await Comment.delete(id);
  res.status(204).json(deletedComment);
}

module.exports = router;
