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

function tutorial_video_upload(req, res, next) {
  const upload = multer({ storage: storage }).single("tutorial_video_file");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(
        new ApiError(
          400,
          "An error occurred while uploading the tutorial_video"
        )
      );
    } else if (err) {
      return next(
        new ApiError(
          500,
          "An unknown error occurred while uploading the tutorial_video"
        )
      );
    }
    next();
  });
}

module.exports = tutorial_video_upload;
