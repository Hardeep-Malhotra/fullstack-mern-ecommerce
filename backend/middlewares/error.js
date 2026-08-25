const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // केवल असली Server Errors (500) को ही Console में Log करें
  if (err.statusCode === 500) {
    console.error("SERVER ERROR STACK:", err.stack || err);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;