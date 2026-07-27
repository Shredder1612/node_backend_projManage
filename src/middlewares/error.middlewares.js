import { ApiError } from "../utils/api-error.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      (error.name === "ValidationError" || error.name === "CastError"
        ? 400
        : 500);
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "Field";
    error.statusCode = 409;
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  const response = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    success: false,
    data: null,
  };

  return res.status(error.statusCode).json(response);
};
