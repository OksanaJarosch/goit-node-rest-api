const express = require("express");
const { validateBody } = require("../helpers");
const { registerUserSchema, loginUserSchema } = require("../schemas/userSchemas");
const { register, login, getCurrent, logout } = require("../controllers/authControllers");
const { authenticate } = require("../middlewares");

const authRouter = express.Router();


authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);

module.exports = authRouter;