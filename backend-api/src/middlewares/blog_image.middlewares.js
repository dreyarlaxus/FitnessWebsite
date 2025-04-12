const multer = require("multer");
const path = require("path");
const ApiError = require("../api-error");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

function Blog_Image_Upload(req, res, next) {
  const upload = multer({ storage: storage }).single("blog_image_file");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(
        new ApiError(400, "An error occurred while uploading the blog's image")
      );
    } else if (err) {
      return next(
        new ApiError(
          500,
          "An unknown error occurred while uploading the blog's image"
        )
      );
    }
    next();
  });
}

module.exports = Blog_Image_Upload;
