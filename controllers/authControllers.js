const {HttpError} = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
var gravatar = require('gravatar');


const register = async (req, res) => {
    try {
        const { password, email } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email);

        const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword });
        
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL
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
    const { _id: id } = user;
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        throw HttpError(401, "Email or password is wrong");
    };

    payload = {
        id
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(id, { token });

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    });
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({ message: "No Content" });
};

const updateSubscription = async (req, res) => {
    const { id } = req.params;
    const result = await User.findByIdAndUpdate(id, req.body, {new: true});
        if (!result) {
        throw HttpError(404);
    }
    res.status(200).json(result);
}


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription)
};