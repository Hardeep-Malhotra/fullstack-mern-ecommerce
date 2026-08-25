// validators/productValidator.js
import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(300).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name cannot exceed 300 characters",
    "any.required": "Product name is required",
  }),

  description: Joi.string().trim().required().messages({
    "string.empty": "Product description is required",
    "any.required": "Product description is required",
  }),

  price: Joi.number().min(0).max(9999999).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "number.max": "Price cannot exceed 7 digits",
    "any.required": "Price is required",
  }),

  category: Joi.string().trim().required().messages({
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),

  stock: Joi.number().integer().min(0).max(99999).default(1).messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
    "number.max": "Stock cannot exceed 99999",
  }),
});
export const createReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().trim().required().messages({
    "any.required": "Comment is required",
  }),
  productId: Joi.string().required().messages({
    "any.required": "Product ID is required",
  }),
});
