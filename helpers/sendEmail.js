const sgMail = require("@sendgrid/mail");
const {API_KEY} = require("../config");


sgMail.setApiKey(API_KEY);

const sendEmail = async (data) => {
    const email = { ...data, from: "ok.jarosch@gmail.com" };
    await sgMail.send(email);
    return { ok: true };
};

module.exports = sendEmail;