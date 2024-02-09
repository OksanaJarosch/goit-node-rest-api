const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: path.resolve("tmp"),
    filename: (req, file, cb) => {
        const preffix = `${Date.now()}_${Math.round(Math.random() * 10)}`;
        const uniqueName = `${preffix}_${file.originalname}`;
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