// Middleware/multer.js
// Multer configuration for handling image uploads (used with Cloudinary streaming)

import multer from "multer";

// Use memory storage since we upload directly to Cloudinary (no temp files)
const storage = multer.memoryStorage();

// File filter: Allow only specific image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/avif"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type. Only JPEG, PNG, GIF, and AVIF are allowed."),
      false
    );
  }

  cb(null, true); // Accept the file
};

// Configure Multer with storage, file type validation, and size limit
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter,
});

export default upload;
