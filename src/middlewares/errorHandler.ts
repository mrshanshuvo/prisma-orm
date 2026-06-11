import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/errors";
import { sendResponse } from "../utils/sendResponse";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  const errorDetail = err.message || err;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message && err.message.toLowerCase().includes("not found")) {
    statusCode = 404;
    message = "Not Found";
  }

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    error: errorDetail,
  });
};
