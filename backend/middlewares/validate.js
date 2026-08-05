// export const validateBody = (schema) => {
//   return (req, res, next) => {
//     const { error, value } = schema.validate(req.body, {
//       abortEarly: false,
//       stripUnknown: true,
//     });

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation Error",
//         errors: error.details.map((detail) => detail.message),
//       });
//     }

//     req.body = value;
//     next();
//   };
// };

// ✅ CORRECT (Production Fixed Version):
export const validateBody = (schema) => {
  return (req, res, next) => {
    // Destructure using 'validationError' to avoid variable shadowing with Express handlers
    const { error: validationError, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: validationError.details.map((detail) => detail.message),
      });
    }

    req.body = value;
    next(); // Ab ye clean express 'next' function execute karega!
  };
};