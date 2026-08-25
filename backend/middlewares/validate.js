// middlewares/validate.js
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error: validationError, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true, // Unknown / extra FormData fields crash nahi hone dega
      convert: true, // String "399" ko number 399 me transform karega
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: validationError.details.map((detail) => detail.message),
      });
    }

    req.body = value;
    next();
  };
};
