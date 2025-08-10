import express from "express";
import multer from "multer";
import path from "path";
import {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  getUsers,
  logout,
} from "../controllers/authControllers.js";

const router = express.Router();

// Multer setup with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  // Check file type
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

router.get("/signup", getSignup);

router.post(
  "/signup",
  upload.single("photo"),
  (req, res, next) => {
    if (req.fileValidationError) {
      req.flash("error", req.fileValidationError);
      return res.redirect("/signup");
    }
    next();
  },
  (err, req, res, next) => {
    if (err) {
      if (err.message === "Only JPEG and PNG files are allowed") {
        req.flash("error", "Only JPEG and PNG files are allowed");
      } else if (err.code === "LIMIT_FILE_SIZE") {
        req.flash("error", "File size too large. Maximum size is 5MB.");
      } else {
        req.flash("error", "File upload error: " + err.message);
      }
      return res.redirect("/signup");
    }
    next();
  },
  postSignup
);

router.get("/login", getLogin);

router.post("/login", postLogin);

router.get("/users", isAuthenticated, getUsers);

router.get("/logout", logout);

export default router;
