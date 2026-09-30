const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the ensured uploads directory
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-'); // Replace spaces with dashes
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = upload;

