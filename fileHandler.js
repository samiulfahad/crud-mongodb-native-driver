const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if the directory exists
    if (!fs.existsSync("./avatar")) {
      fs.mkdirSync("./avatar");
    }

    cb(null, "./avatar");
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName = Date.now() + fileExt;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/pnj"
  ) {
    cb(null, true);
  } else {
    req.fileUploadError = "Only jpg, jpeg and pnj are allowed";
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1000000
  }
});

exports.fileSizeError = (err, req, res, next) => {
  if(err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.fileUploadError = 'Max File Size is 1MB'
      next()
    }
  }
  next()
}


exports.upload = upload;
