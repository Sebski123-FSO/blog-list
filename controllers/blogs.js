const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { userName: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const auth = request.get("Authorization");

  if (!auth || !auth.startsWith("bearer ")) {
    return response.status(400).json({
      error: "missing auth token",
    });
  }

  const authToken = auth.substring(7);
  const decodedToken = jwt.verify(authToken, process.env.SECRET);
  if (!decodedToken) {
    return response.status(400).json({
      error: "invalid auth token",
    });
  }

  const user = await User.findById(decodedToken.id);
  const blog = new Blog({ ...request.body, user: user.id });
  const result = await blog.save();

  user.blogs.push(blog._id);
  user.save();
  response.status(201).json(result);
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true, runValidators: true, context: "query" });

  response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  await Blog.findByIdAndDelete(id);

  response.status(204).end();
});

module.exports = blogsRouter;
