const {HttpError} = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
var gravatar = require('gravatar');
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");


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
    const result = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    res.status(200).json(result);
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { filename } = req.file;
    const oldPath = path.resolve("tmp", filename)
    const newPath = path.resolve("public", "avatars", filename);

    //Resizing
    const avatar = await Jimp.read(oldPath);
    if (!avatar) {
        throw HttpError(400, "Upload Error");
    }
    await avatar.resize(250, 250).write(oldPath);
    
    //Relocate to public/avatars
    await fs.rename(oldPath, newPath);
    const poster = path.join("public", "avatars", filename);
    const result = await User.findByIdAndUpdate(_id, { avatarURL: poster}, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    res.status(200).json({
        avatarURL: result.avatarURL
    });
}


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar)
};