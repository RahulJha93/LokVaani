const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { handleUpload } = require("../controller/fileUploadController.js");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config - updated to use dedicated server storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage }); // Use the storage config instead of just dest

router.post("/", upload.single("video"), handleUpload);

module.exports = router;
