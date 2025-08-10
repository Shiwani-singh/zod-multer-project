import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import multer from 'multer';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// View & Static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session & Flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // use environment variable or fallback
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions', // optional
    ttl: 14 * 24 * 60 * 60 // 14 days expiration
  }),
  cookie: {
    secure: false, // set true if HTTPS
    httpOnly: true, // prevents JS access to cookie
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session?.user || null; // optional chaining to avoid creating a new session
  next();
});

app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(authRoutes);
app.use(dashboardRoutes);

app.get('/', (req, res) => {
  res.redirect('/signup');
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.flash('error', 'File size too large. Maximum size is 5MB.');
    } else {
      req.flash('error', 'File upload error: ' + err.message);
    }
    return res.redirect('/signup');
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    req.flash('error', 'Validation error: ' + err.message);
    return res.redirect('/signup');
  }
  
  // Handle other errors
  req.flash('error', 'Something went wrong. Please try again.');
  res.redirect('/signup');
});

// 404 handler for unmatched routes
app.use('/{*any}', (req, res) => {
  res.status(404).render('error', { 
    message: 'Page not found',
    error: { status: 404, stack: 'Page not found' }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
