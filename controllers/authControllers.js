const {HttpError} = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ ...req.body, password: hashPassword });
        
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription
            }
        })
    } catch (error) {
        if (error.message.includes("E11000")) {
            throw HttpError(409, "Email in use");
        }
        throw HttpError();
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        throw HttpError(401, "Email or password is wrong");
    }

    res.status(200).json({
        token: "exampletoken",
        user: {
            email: user.email,
            subscription: user.subscription
        }
    });

};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login)
};