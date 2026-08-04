import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createProducts = asyncHandler(async (req, res) => {

    // Future
    // req.body.user = req.user._id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });

});