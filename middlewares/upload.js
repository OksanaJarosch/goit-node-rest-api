const multer = require("multer");
const path = require("path");
const Jimp = require("jimp");


const storage = multer.diskStorage({
    destination: path.resolve("tmp"),
    filename: async (req, file, cb) => {
        const { _id } = req.user;
        const preffix = `${Date.now()}`;
        const uniqueName = `${_id}_${preffix}_${file.originalname}`;
        cb(null, uniqueName);
    }
}); 

const limits = {
    fileSize: 1024 * 1024 * 5
};


const upload = multer({
    storage,
    limits
});

module.exports = upload;