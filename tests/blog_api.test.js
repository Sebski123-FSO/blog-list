const Blog = require("../models/blog");
const app = require("../app");
const helper = require("./test_helper");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const noteObjects = helper.initialBlogs.map((note) => new Blog(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const blogs = await helper.blogsInDb();

  expect(blogs.length).toBe(helper.initialBlogs.length);
});

test("a specific blog is within the returned notes", async () => {
  const blogs = await helper.blogsInDb();
  const content = blogs.map((blog) => blog.title);

  expect(content).toContain(helper.initialBlogs[0].title);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "test blog 4",
    author: "yoo",
    url: "example.com/4",
    likes: 5318008,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await helper.blogsInDb();
  const content = blogs.map((blog) => blog.title);

  expect(blogs.length).toBe(helper.initialBlogs.length + 1);
  expect(content).toContain(newBlog.title);
});

test("blog without content is not added", async () => {
  const newBlog = {
    likes: 4,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogs = await helper.blogsInDb();
  const content = blogs.map((blog) => blog.title);

  expect(blogs.length).toBe(helper.initialBlogs.length);
  expect(content).not.toContain(newBlog.title);
});

test("returned blog has 'id' property", async () => {
  const notes = await helper.blogsInDb();
  const note = notes[0];

  expect(note.id).toBeDefined();
});

test("entry with no like count will default to zero", async () => {
  const newBlog = {
    title: "test blog 4",
    author: "yoo",
    url: "example.com/4",
  };

  await api.post("/api/blogs").send(newBlog);

  const blogs = await helper.blogsInDb();
  const newlyAddedBlog = blogs[blogs.length - 1];

  expect(newlyAddedBlog.likes).toBe(0);
});

// test.only("a specific blog can be viewed", async () => {
//   const blogsAtStart = await helper.blogsInDb();

//   const blogToView = blogsAtStart[0];
//   console.log(blogToView);

//   const resultBlog = await api
//     .get(`/api/notes/${blogToView.id}`)
//     .expect(200)
//     .expect("Content-Type", /application\/json/);

//   const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

//   expect(resultBlog.body).toEqual(processedBlogToView);
// });

// test("a blog can be deleted", async () => {});

afterAll(() => {
  mongoose.connection.close();
});
