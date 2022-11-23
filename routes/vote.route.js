"use strict";
const express = require("express");
const router = express.Router();

const { Vote } = require("../models/index");

router.get("/vote", getVotes);
router.get("/vote/:id", getVote);
router.post("/vote/:userId/:postId", createVote);
router.put("/vote/:id", updateVote);
router.delete("/vote/:id", deleteVote);
router.get("/postvote/:postId", getPostVotes);

async function getPostVotes(req, res) {
  try {
    const postId = req.params.postId;
    let postVotes = await Vote.getPostVotes(postId);
    res.status(200).json(postVotes);
  } catch (e) {
    res.status(500).send("Server Error");
  }
}

async function getVotes(req, res) {
  try {
    let allVotes = await Vote.read();
    res.status(200).json(allVotes);
  } catch (e) {
    res.status(500).send("Server Error");
  }
}

async function getVote(req, res) {
  try {
    const id = req.params.id;
    let oneVote = await Vote.read(id);
    res.status(200).json(oneVote);
  } catch (e) {
    res.status(500).send("Server Error");
  }
}

async function createVote(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    let obj = req.body;
    obj.userId = userId;
    obj.postId = postId;
    let newVote = await Vote.create(obj);
    res.status(201).json(newVote);
  } catch (e) {
    res.status(500).send("Server Error");
  }
}

async function updateVote(req, res) {
  try {
    const id = req.params.id;
    let obj = req.body;
    let foundVote = await Vote.read(id);
    let updatedVote = await foundVote.update(obj);
    res.status(202).json(updatedVote);
  } catch (e) {
    res.status(500).send("Server Error");
  }
}

async function deleteVote(req, res) {
  try {
    const id = req.params.id;
    let deletedVote = await Vote.delete(id);
    res.status(204).json(deletedVote);
  } catch (e) {
    res.status(500).send("Server Error");
  }
}

module.exports = router;
