import multer from "multer";
import path from "path";
import ErrorHandler from "../utils/errorHandler.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allowed Extensions & Mimetypes
  const allowedExtensions = /jpeg|jpg|png|webp|gif/;

  // File ka extension check karein (.jpg, .png etc.)
  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );

  // File ka mimetype check karein
  const isMimeImage = file.mimetype && file.mimetype.startsWith("image/");

  // Agar extension match ho gaya YA mimetype image hai
  if (extName || isMimeImage) {
    cb(null, true);
  } else {
    cb(new ErrorHandler("Only image files are allowed", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
