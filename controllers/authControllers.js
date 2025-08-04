import bcrypt from "bcrypt";
import { z } from "zod";
import User from "../models/User.js";
import { ca } from "zod/locales";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "⚠ Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const getSignup = (req, res) => {
  res.render("signup");
};

export const postSignup = async (req, res) => {
  const { username, email, password } = req.body;
  const photo = req.file;

  try {
    userSchema.parse({ username, email, password });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email is already registered.");
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      photo: photo.filename,
    });

    await user.save();
    // console.log("User created", user);

    req.flash("success", "Signup successful!");
    res.redirect("/login");
  } catch (err) {
    if (err.errors) {
      const message = err.errors.map((e) => e.message).join(", ");
      req.flash("error", message);
      return res.redirect("/signup");
    } else {
      console.error(err);
      req.flash("error", "Server error");
      return res.redirect("/signup");
    }
  }
};

export const getLogin = (req, res) => {
  res.render("login");
};

export const postLogin = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => {
        if (err.path[0] === "email") return "⚠ Invalid email address.";
        if (err.path[0] === "password") return "⚠ Password is too short.";
        return "⚠ Please fill the valid email or password.";
      });
      req.flash("error", errorMessages);
      return res.redirect("/login");
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "User not found, Please Signup");
      return res.redirect("/login");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      req.flash("error", "Invalid Password");
      return res.redirect("/login");
    }

    res.redirect("/users");
  } catch (err) {
    console.error(err);
    req.flash("error", "Server error");
    return res.redirect("/login");
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render("users", { users });
    console.log(users.photo); // it should be just the filename, not a full path

  } catch (err) {
    console.error(err);
    req.flash("error", "Server error");
    res.redirect("/login");
  }
};
