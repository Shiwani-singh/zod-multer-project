import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signupSchema, loginSchema } from "../shared/zodSchema.js";

export const getSignup = (req, res) => {
  res.render("signup");
};

export const postSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const photo = req.file ? req.file.filename : null;

    const validationResult = signupSchema.safeParse({ name, email, phone, password });
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(err => err.message).join(", ");
      req.flash("error", errorMessages);
      return res.redirect("/signup");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email is already registered.");
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      photo: photo,
    });

    await user.save();

    req.flash("success", "Signup successful!");
    res.redirect("/login");
  } catch (err) {
    if (err.issues) {
      const message = err.issues.map((e) => e.message).join(", ");
      req.flash("error", message);
      return res.redirect("/signup");
    } else {
      console.error(err);
      req.flash("error", "Server error/Something Went Wrong");
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
        if (err.path[0] === "email") return "Invalid email address.";
        if (err.path[0] === "password") return "Password is too short.";
        return "Please fill the valid email or password.";
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

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.redirect("/dashboard");
    console.log("User logged in:", user.name);
    req.flash("success", "Login successful!");

  } catch (err) {
    console.error(err);
    req.flash("error", "Server error");
    return res.redirect("/login");
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render("users", { 
      users, 
      currentUser: req.session.user, 
      id: req.session.user?.id
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Server error");
    res.redirect("/login");
  }
};  

export const logout = (req, res) => {
 req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.send("Error logging out");
    }
    res.clearCookie("connect.sid", { path: "/" });
    console.log("User logged out from post logout");
    res.redirect("/login");
  });
};

