import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";


export const getAllProducts = asyncHandler(async(req , res , next) =>{

    const allProducts = await Product.find();

    res.status(200).json({
        success:true,
        message:"All Products",
        allProducts,
    })
})