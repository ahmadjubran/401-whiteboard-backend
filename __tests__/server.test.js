"use strict";

const supertest = require("supertest");
const { app } = require("../server");
const request = supertest(app);

// thrown: "Exceeded timeout of 5000 ms for a test.
//     Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."

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

describe("Server", () => {
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
    expect(response.status).toEqual(200);
    expect(response.body[0]).toEqual(1);
  });

  it("should delete a post", async () => {
    const response = await request.delete("/post/1");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(1);
  });
});
