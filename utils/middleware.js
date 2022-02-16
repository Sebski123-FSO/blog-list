const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

const tokenExtractor = (req, res, next) => {
  const auth = req.get("Authorization");

  if (auth.startsWith("bearer ")) {
    const authToken = auth.substring(7);
    req.token = authToken;
  }

  next();
};

const errorLogger = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { errorLogger, tokenExtractor };
