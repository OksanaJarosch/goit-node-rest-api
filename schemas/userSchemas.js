const Joi = require("joi");

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const registerUserSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required().pattern(emailRegex),
    subscription: Joi.string()
});

const loginUserSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required().pattern(emailRegex),
    token: Joi.string().required()
});

module.exports = { registerUserSchema, loginUserSchema };