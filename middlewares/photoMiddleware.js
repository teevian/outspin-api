const multer = require("multer");
const sharp = require("sharp");


/*
|const multerStorage = multer.diskStorage({
|    destination: (req, file, cb) => {
|        cb(null, process.env.IMG_DIRECTORY);
|    },
|    filename: (req, file, cb) => {
|        const ext = file.mimetype.split("/")[1];
|        cb(null, "user-" + req.id + "-" + Date.now() + "." + ext);
|    }
|});*/

 const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image")){
        cb(null, true);
    } else {
        cb(new ApiError("Not an image! Please upload a image!", 400));
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();

    req.body = { data: { items: [{ photo:  "user-" + req.id + "-" + Date.now() + ".jpeg" }] } };

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg( { quality: 90 } )
        .toFile(process.env.IMG_DIRECTORY + "/" + req.file.filename);
    next();
}

