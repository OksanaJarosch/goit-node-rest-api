const {HttpError, ctrlWrapper, sendEmail} = require("../helpers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, BASE_URL } = require("../config");
var gravatar = require('gravatar');
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");


const register = async (req, res) => {
    try {
        const { password, email } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email);

        const verificationToken = uuidv4();

        const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword, verificationToken });
        
        const verifyEmail = {
            to: email,
            subject: "Verification",
            html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify your email<a>`
        };

        await sendEmail(verifyEmail);

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
                verificationToken: newUser.verificationToken
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

    if (!user.verify) {
        throw HttpError(401, "Pleace verify your email");
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
    const result = await User.findByIdAndUpdate(_id, { avatarURL: poster }, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    res.status(200).json({
        avatarURL: result.avatarURL
    });
};

const verification = async (req, res) => {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(401, "Email not found");
    };
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.status(200).json({ message: 'Verification successful' });
};

const resendVerification = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({email});
    if (!user) {
        throw HttpError(400, "Missing required field email")
    };
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
    };

    const verificationToken = uuidv4();

    await User.findByIdAndUpdate(user._id, { verificationToken });

    const verifyEmail = {
        to: email,
        subject: "Verification",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify your email<a>`
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
        "message": "Verification email sent"
    });
};


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
    verification: ctrlWrapper(verification),
    resendVerification: ctrlWrapper(resendVerification)
};