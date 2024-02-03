const {HttpError} = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");


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
    const { email } = req.user;
    res.json({ email });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({ message: "No Content" });
};


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout)
};