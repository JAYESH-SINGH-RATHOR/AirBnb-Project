import Joi from "joi";

const listingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        imgaes: Joi.string().allow(""),
        Price: Joi.number().required(),
        Country: Joi.string().required(),
        Location: Joi.string().required(),
    }).required()
});

export {listingSchema};


const reviewSchema = Joi.object({
    review : Joi.object({
        Rating : Joi.number().required().min(1).max(5),
        Comment : Joi.string().required()
    }).required()
})

export {reviewSchema};