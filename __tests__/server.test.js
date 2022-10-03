"use strict";

const supertest = require("supertest");
const { app } = require("../server");
const request = supertest(app);

const random1 = Math.floor(Math.random() * 1000);
const random2 = Math.floor(Math.random() * 1000);

let adminToken;
let userToken;
let postId;
let commentId;

describe("server", () => {
  it("should handle not found routes", async () => {
    const response = await request.get("/bad");
    expect(response.status).toEqual(404);
  });

  it("should handle home route", async () => {
    const response = await request.get("/");
    expect(response.status).toEqual(200);
    expect(response.body.messige).toEqual("Home page");
    expect(response.body.code).toEqual(200);
  });
});

describe("Users", () => {
  it("should create an admin", async () => {
    const response = await request.post("/signup").send({
      userName: `test${random1}${random2}`,
      email: `test${random1}@test${random2}.com`,
      password: "123456",
      role: "admin",
    });

    expect(response.status).toEqual(201);
    expect(response.body.User.userName).toEqual(`test${random1}${random2}`);
    expect(response.body.User.email).toEqual(
      `test${random1}@test${random2}.com`
    );
  });

  it("should create a user", async () => {
    const response = await request.post("/signup").send({
      userName: `test${random2}${random1}`,
      email: `test${random2}@test${random1}.com`,
      password: "123456",
      role: "user",
    });

    expect(response.status).toEqual(201);
    expect(response.body.User.userName).toEqual(`test${random2}${random1}`);
    expect(response.body.User.email).toEqual(
      `test${random2}@test${random1}.com`
    );
  });

  it("should login an admin", async () => {
    const response = await request
      .post("/login")
      .auth(`test${random1}${random2}`, "123456");

    expect(response.status).toEqual(200);
    expect(response.body.User.userName).toEqual(`test${random1}${random2}`);
    expect(response.body.User.email).toEqual(
      `test${random1}@test${random2}.com`
    );

    adminToken = response.body.token;
  });

  it("should login a user", async () => {
    const response = await request
      .post("/login")
      .auth(`test${random2}${random1}`, "123456");

    expect(response.status).toEqual(200);
    expect(response.body.User.userName).toEqual(`test${random2}${random1}`);
    expect(response.body.User.email).toEqual(
      `test${random2}@test${random1}.com`
    );

    userToken = response.body.token;
  });

  it("should get users info", async () => {
    const response = await request
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("Posts", () => {
  it("should create a new post", async () => {
    const response = await request
      .post(`/post/1`)
      .send({
        title: "test post",
        content: "test content",
      })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toEqual(201);
    expect(response.body.title).toEqual("test post");
    expect(response.body.content).toEqual("test content");

    postId = response.body.id;
  });

  it("should get all posts", async () => {
    const response = await request
      .get("/post")
      .set({ Authorization: `Bearer ${adminToken}` });

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get one post", async () => {
    const response = await request.get(`/post/${postId}`).set({
      Authorization: `Bearer ${adminToken}`,
    });

    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual("test post");
  });

  it("should update a post", async () => {
    const response = await request
      .put(`/post/${postId}`)
      .send({
        title: "test post updated",
        content: "test content updated",
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });
    expect(response.status).toEqual(202);
    expect(response.body.title).toEqual("test post updated");
    expect(response.body.content).toEqual("test content updated");
  });
});

describe("Comments", () => {
  it("should create a new comment", async () => {
    const response = await request.post(`/comment/1/${postId}`).send({
      content: "test comment",
    });
    expect(response.status).toEqual(201);
    expect(response.body.content).toEqual("test comment");

    commentId = response.body.id;
  });

  it("should get all comments", async () => {
    const response = await request.get("/comment");
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get one comment", async () => {
    const response = await request.get(`/comment/${commentId}`);
    expect(response.status).toEqual(200);
    expect(response.body.content).toEqual("test comment");
  });

  it("should update a comment", async () => {
    const response = await request.put(`/comment/${commentId}`).send({
      content: "test comment updated",
    });
    expect(response.status).toEqual(202);
    expect(response.body.content).toEqual("test comment updated");
  });

  it("should delete a comment", async () => {
    const response = await request.delete(`/comment/${commentId}`);
    expect(response.status).toEqual(204);
  });

  it("should delete a post", async () => {
    const response = await request.delete(`/post/${postId}`).set({
      Authorization: `Bearer ${adminToken}`,
    });

    expect(response.status).toEqual(204);
  });
});
