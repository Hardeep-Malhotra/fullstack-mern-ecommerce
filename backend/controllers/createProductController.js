import Product from "../models/productModel.js";


export const createProducts = async (req , res) =>{
    res.status(200).json({
        success:true,
        message:"Product Successfully created",
        data:req.body
    })
};
