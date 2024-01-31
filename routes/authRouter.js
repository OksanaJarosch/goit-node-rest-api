const express = require("express");
const { validateBody } = require("../helpers");
const { registerUserSchema, loginUserSchema } = require("../schemas/userSchemas");
const { register, login } = require("../controllers/authControllers")
   
const authRouter = express.Router();


authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);


module.exports = authRouter;