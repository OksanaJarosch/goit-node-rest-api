const { Schema, model } = require("mongoose");

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userSchema = new Schema ({
    password: {
    type: String,
    required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        match: emailRegex,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: String
},
{ versionKey: false, timestamps: true }
);

const User = model("user", userSchema);

module.exports = User;