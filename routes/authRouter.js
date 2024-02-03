const express = require("express");
const { validateBody } = require("../middlewares");
const { isValidId } = require("../middlewares");
const { registerUserSchema, loginUserSchema, updateSubscriptionSchema } = require("../schemas/userSchemas");
const { register, login, getCurrent, logout, updateSubscription } = require("../controllers/authControllers");
const { authenticate } = require("../middlewares");

const authRouter = express.Router();


authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch("/:id/subscription", authenticate, isValidId, validateBody(updateSubscriptionSchema), updateSubscription);

module.exports = authRouter;