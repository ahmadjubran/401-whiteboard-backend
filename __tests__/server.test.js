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

let token;
describe("Users", () => {
  const random1 = Math.floor(Math.random() * 1000);
  const random2 = Math.floor(Math.random() * 1000);

  it("should create a new user", async () => {
    const response = await request.post("/signup").send({
      userName: `test${random1}${random2}`,
      email: `test${random1}@test${random2}.com`,
      password: "123456",
    });
    expect(response.status).toEqual(201);
    expect(response.body.userName).toEqual(`test${random1}${random2}`);
    expect(response.body.email).toEqual(`test${random1}@test${random2}.com`);
  });

  it("should login with basic", async () => {
    const response = await request
      .post("/login")
      .auth(`test${random1}${random2}`, "123456");

    expect(response.status).toEqual(200);
    expect(response.body.User.userName).toEqual(`test${random1}${random2}`);
    expect(response.body.User.email).toEqual(
      `test${random1}@test${random2}.com`
    );

    token = response.body.token;
  });

  console.log(token);
  it("should show all users", async () => {
    const response = await request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Posts", () => {
  const random1 = Math.floor(Math.random() * 1000);
  const random2 = Math.floor(Math.random() * 1000);

  it("should create a new post", async () => {
    const response = await request.post(`/post/1`).send({
      id: `${random1}${random2}`,
      title: "test post",
      content: "test content",
    });
    expect(response.status).toEqual(201);
    expect(response.body.title).toEqual("test post");
    expect(response.body.content).toEqual("test content");
  });

  it("should get all posts", async () => {
    const response = await request
      .get("/post")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should get one post", async () => {
    const response = await request.get(`/post/${random1}${random2}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual("test post");
    expect(response.body.content).toEqual("test content");
  });

  it("should update a post", async () => {
    const response = await request.put(`/post/${random1}${random2}`).send({
      title: "updated post",
      content: "updated content",
    });
    expect(response.status).toEqual(202);
    expect(response.body.title).toEqual("updated post");
    expect(response.body.content).toEqual("updated content");
  });

  it("should delete a post", async () => {
    const response = await request.delete(`/post/${random1}${random2}`);
    expect(response.status).toEqual(204);
  });
});

describe("Comments", () => {
  const random1 = Math.floor(Math.random() * 1000);
  const random2 = Math.floor(Math.random() * 1000);

  it("should create a new post", async () => {
    const response = await request.post("/post/1").send({
      id: `${random1}${random2}`,
      title: "test post",
      content: "test content",
    });
    expect(response.status).toEqual(201);
    expect(response.body.title).toEqual("test post");
    expect(response.body.content).toEqual("test content");
  });

  it("should create a new comment", async () => {
    const response = await request
      .post(`/comment/1/${random1}${random2}`)
      .send({
        id: `${random1}${random2}`,
        content: "test comment",
      });
    expect(response.status).toEqual(201);
    expect(response.body.content).toEqual("test comment");
    expect(response.body.userId).toEqual(1);
    expect(response.body.postId).toEqual(Number(`${random1}${random2}`));
  });

  it("should get all comments", async () => {
    const response = await request.get("/comment");
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get one comment", async () => {
    const response = await request.get(`/comment/${random1}${random2}`);
    expect(response.status).toEqual(200);
    expect(response.body.content).toEqual("test comment");
  });

  it("should update a comment", async () => {
    const response = await request.put(`/comment/${random1}${random2}`).send({
      content: "updated comment",
    });
    expect(response.status).toEqual(202);
    expect(response.body.content).toEqual("updated comment");
  });

  it("should delete a comment", async () => {
    const response = await request.delete(`/comment/${random1}${random2}`);
    expect(response.status).toEqual(204);
  });

  it("should delete a post", async () => {
    const response = await request.delete(`/post/${random1}${random2}`);
    expect(response.status).toEqual(204);
  });
});
