const express = require("express");
const { validateBody } = require("../helpers");
const { registerUserSchema, loginUserSchema } = require("../schemas/userSchemas");
const { register } = require("../controllers/authControllers")

const authRouter = express.Router();


authRouter.post("/register", validateBody(registerUserSchema), register);


module.exports = authRouter;