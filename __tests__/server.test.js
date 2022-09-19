"use strict";

const supertest = require("supertest");
const { app } = require("../server");
const request = supertest(app);

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

describe("Posts", () => {
  it("should create a new post", async () => {
    const response = await request.post("/post").send({
      id: 1,
      title: "test post",
      content: "test content",
    });
    expect(response.status).toEqual(201);
    expect(response.body.title).toEqual("test post");
    expect(response.body.content).toEqual("test content");
  });

  it("should get all posts", async () => {
    const response = await request.get("/post");
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get one post", async () => {
    const response = await request.get("/post/1");
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual("test post");
    expect(response.body.content).toEqual("test content");
  });

  it("should update a post", async () => {
    const response = await request.put("/post/1").send({
      title: "updated post",
      content: "updated content",
    });
    expect(response.status).toEqual(202);
    expect(response.body.title).toEqual("updated post");
    expect(response.body.content).toEqual("updated content");
  });

  it("should delete a post", async () => {
    const response = await request.delete("/post/1");
    expect(response.status).toEqual(204);
  });
});

describe("Comments", () => {
  it("should create a new comment", async () => {
    const response = await request.post("/comment/10").send({
      id: 20,
      content: "test comment",
    });
    expect(response.status).toEqual(201);
    expect(response.body.content).toEqual("test comment");
    expect(response.body.postId).toEqual(10);
  });

  it("should get all comments", async () => {
    const response = await request.get("/comment");
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get one comment", async () => {
    const response = await request.get("/comment/20");
    expect(response.status).toEqual(200);
    expect(response.body.content).toEqual("test comment");
  });

  it("should update a comment", async () => {
    const response = await request.put("/comment/20").send({
      content: "updated comment",
    });
    expect(response.status).toEqual(202);
    expect(response.body.content).toEqual("updated comment");
  });

  it("should delete a comment", async () => {
    const response = await request.delete("/comment/20");
    expect(response.status).toEqual(204);
  });
});

describe("Users", () => {
  it("should create a new user", async () => {
    const response = await request.post("/signup").send({
      userName: "test",
      email: "test@test.com",
      password: "123456",
    });
    expect(response.status).toEqual(201);
    expect(response.body.userName).toEqual("test");
    expect(response.body.email).toEqual("test@test.com");
  });

  it("should get all users", async () => {
    const response = await request.get("/users");
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should login", async () => {
    const response = await request.post("/login").auth("test", "123456");
    expect(response.status).toEqual(200);
    expect(response.body.userName).toEqual("test");
    expect(response.body.email).toEqual("test@test.com");
  });
});
