export const getProducts = async  (req , res) =>{
    res.status(200).json({
        success:true,
        message:"All Products."
    })
}