const express = require("express");
const { isValidId, upload, authenticate, validateBody } = require("../middlewares");
const { registerUserSchema, loginUserSchema, updateSubscriptionSchema, emailVerifySchema } = require("../schemas/userSchemas");
const { register, login, getCurrent, logout, updateSubscription, updateAvatar, verification, resendVerification } = require("../controllers/authControllers");

const authRouter = express.Router();


authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch("/:id/subscription", authenticate, isValidId, validateBody(updateSubscriptionSchema), updateSubscription);
authRouter.patch("/avatars", authenticate, upload.single("avatarURL"), updateAvatar);
authRouter.get("/verify/:verificationToken", verification);
authRouter.get("/verify", validateBody(emailVerifySchema), resendVerification);

module.exports = authRouter;