    import Joi from "joi";

export const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      "string.empty": "Product name cannot be empty",
      "string.min": "Product name must be at least 3 characters",
      "string.max": "Product name cannot exceed 100 characters",
    }),

  description: Joi.string()
    .trim()
    .messages({
      "string.empty": "Product description cannot be empty",
    }),

  price: Joi.number()
    .min(0)
    .max(9999999)
    .messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
      "number.max": "Price cannot exceed 7 digits",
    }),

  category: Joi.string()
    .trim()
    .messages({
      "string.empty": "Category cannot be empty",
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .max(99999)
    .messages({
      "number.base": "Stock must be a number",
      "number.min": "Stock cannot be negative",
      "number.max": "Stock cannot exceed 99999",
    }),
});