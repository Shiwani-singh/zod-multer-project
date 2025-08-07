import express from "express";
import multer from "multer";
import path from "path";
import {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  getUsers,
} from "../controllers/authControllers.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/signup", getSignup);

router.post(
  "/signup",
  upload.single("photo"),
  (req, res, next) => {
    console.log("File:", req.file); // <- Check if it's undefined
    next();
  },
  postSignup
);

router.get("/login", getLogin);

router.post("/login", postLogin);

router.get("/users", getUsers);

export default router;
