require("dotenv").config();
require("express-async-errors");
const { errorLogger, tokenExtractor } = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const cors = require("cors");
const express = require("express");
const loginRouter = require("./controllers/login");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(errorLogger);

module.exports = app;
