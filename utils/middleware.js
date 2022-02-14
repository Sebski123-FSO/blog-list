const logger = require("./logger");

const errorLogger = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = { errorLogger };
