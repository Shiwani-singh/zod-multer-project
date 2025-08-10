import User from "../models/User.js";
import { profileUpdateSchema } from "../shared/zodSchema.js";

// Dashboard page with user listing, pagination, search, and sorting
export const getDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "name";
    const sortOrder = req.query.sortOrder || "asc";

    const skip = (page - 1) * limit;

    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sortObject = {};
    sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(searchQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .select('-password'); // Don't send password to frontend

    res.render("dashboard", {
      users,
      currentUser: req.session.user,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      search,
      sortBy,
      sortOrder
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    req.flash("error", "Error loading dashboard");
    res.redirect("/login");
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).select('-password');
    
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/dashboard");
    }

    res.render("profile", {
      user,
      currentUser: req.session.user
    });

  } catch (err) {
    console.error("Profile error:", err);
    req.flash("error", "Error loading profile");
    res.redirect("/dashboard");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const validationResult = profileUpdateSchema.safeParse({ name, email, phone });
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(err => err.message).join(", ");
      req.flash("error", errorMessages);
      return res.redirect("/profile");
    }


    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.session.user.id } 
    });
    
    if (existingUser) {
      req.flash("error", "Email is already taken by another user");
      return res.redirect("/profile");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.session.user.id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      req.flash("error", "User not found");
      return res.redirect("/profile");
    }

    req.session.user = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone
    };

    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");

  } catch (err) {
    console.error("Profile update error:", err);
    req.flash("error", "Error updating profile");
    res.redirect("/profile");
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.session.user.id);
    // console.log(req.session.user.id, "deletedUser")
    
    if (!deletedUser) {
      req.flash("error", "User not found");
      return res.redirect("/profile");
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
      
      res.clearCookie("connect.sid", { path: "/" });
      
      const successMessage = "Account deleted successfully";
      res.redirect(`/signup?message=${encodeURIComponent(successMessage)}`);
    });

  } catch (err) {
    console.error("Account deletion error:", err);
    req.flash("error", "Error deleting account. Please try again.");
    res.redirect("/profile");
  }
};
