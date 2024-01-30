const {HttpError} = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const User = require("../models/user");

const register = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({user: { email: newUser.email,     subscription: newUser.subscription }})
    } catch (error) {
        if (error.message.includes("E11000")) {
            throw HttpError(409, "Email in use");
        }
        throw HttpError();
    }

// TODO: hash with bcrypt
};


module.exports = { register: ctrlWrapper(register) };