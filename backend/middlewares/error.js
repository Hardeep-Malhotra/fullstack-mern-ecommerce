
const errorMiddleware = (err, req, res, next) => {
  console.log("FULL ERROR STACK:", err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  


  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
