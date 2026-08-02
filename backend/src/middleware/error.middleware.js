const { errorResponse } = require("../utils/apiResponse");
const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const errors = err.details || null;

  return errorResponse(res, message, statusCode, errors);
};

module.exports = errorMiddleware;
