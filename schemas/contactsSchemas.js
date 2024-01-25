const Joi = require("joi");

const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phone: Joi.string().pattern(/\d/).min(1).required(),
    favorite: Joi.boolean()
});


const updateContactSchema = Joi
    .object({
    name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2}),
    phone: Joi.string().pattern(/\d/).min(1),
    favorite: Joi.boolean()
})
    .min(1)
    .message("Body must have at least one field");

    
const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
});

module.exports = { createContactSchema, updateContactSchema, updateFavoriteSchema };