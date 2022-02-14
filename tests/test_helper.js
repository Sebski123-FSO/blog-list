const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "test blog 1",
    author: "sebski123",
    url: "example.com",
    likes: 69,
  },
  {
    title: "test blog 2",
    author: "nightfly13",
    url: "example.com/2",
    likes: 420,
  },
  {
    title: "test blog 3",
    author: "chatayne",
    url: "example.com/3",
    likes: 8008,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
