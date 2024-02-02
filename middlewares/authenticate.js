const { SECRET_KEY } = require("../config");
const { HttpError } = require("../helpers");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");


const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, "Not authorized"))
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return next(HttpError(401, "Not authorized"))
    }

    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user) {
            return next(HttpError(401, "Not authorized"))
        }
        
        next();

    } catch (error) {
        next(HttpError(401, "Not authorized"))
    }
};

module.exports = authenticate;