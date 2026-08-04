import Joi from "joi";

export const createProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Product name is required",
            "string.min": "Product name must be at least 3 characters",
            "string.max": "Product name cannot exceed 100 characters",
            "any.required": "Product name is required",
        }),

    description: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Product description is required",
            "any.required": "Product description is required",
        }),

    price: Joi.number()
        .min(0)
        .max(9999999)
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative",
            "number.max": "Price cannot exceed 7 digits",
            "any.required": "Price is required",
        }),

    category: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Category is required",
            "any.required": "Category is required",
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .max(99999)
        .default(1)
        .messages({
            "number.base": "Stock must be a number",
            "number.min": "Stock cannot be negative",
            "number.max": "Stock cannot exceed 99999",
        }),
});