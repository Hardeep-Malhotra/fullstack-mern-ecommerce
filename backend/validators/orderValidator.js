import Joi from "joi";

export const createOrderSchema = Joi.object({
    shippingInfo: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        pinCode: Joi.string().required(),
        phoneNo: Joi.string().required(),
    }).required(),
    orderItems: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                quantity: Joi.number().min(1).required(),
                image: Joi.string().required(),
                product: Joi.string().required(),
            }),
        )
        .min(1)
        .required(),
    paymentInfo: Joi.object({
        id: Joi.string().required(),
        status: Joi.string().required(),
    }).required(),
    taxPrice: Joi.number().min(0).default(0),
    shippingPrice: Joi.number().min(0).default(0),
});
