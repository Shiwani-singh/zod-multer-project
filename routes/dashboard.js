import express from "express";
import { 
  getDashboard, 
  getProfile, 
  updateProfile, 
  deleteAccount 
} from "../controllers/dashboardControllers.js";

const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

router.get("/dashboard", isAuthenticated, getDashboard);
router.get("/profile", isAuthenticated, getProfile);
router.post("/profile/update", isAuthenticated, updateProfile);
router.post("/profile/delete", isAuthenticated, deleteAccount);

export default router;
