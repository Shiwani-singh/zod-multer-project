# Form-Zod-Multer - User Management System

A complete Node.js + Express + MongoDB user management system with authentication, dashboard, and profile management features.

## Features

###  Authentication
- **Signup**: User registration with name, email, password, and optional photo upload
- **Login**: Secure login with session management
- **Logout**: Secure session destruction
- **Password Security**: Bcrypt hashing for all passwords

###  Dashboard
- **User Listing**: Display all users with pagination
- **Search**: Case-insensitive search by name or email
- **Sorting**: Sort by name or creation date (ascending/descending)
- **Pagination**: Server-side pagination with configurable page size

###  Profile Management
- **View Profile**: Display user information and photo
- **Edit Profile**: Update name and email
- **Delete Account**: Permanent account deletion with confirmation
- **Authorization**: Users can only edit/delete their own data

###  Frontend
- **EJS Templates**: Server-side rendering with clean HTML
- **Responsive CSS**: Mobile-friendly design
- **No JavaScript Frameworks**: Pure HTML forms and minimal CSS

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose ODM
- **Sessions**: Express-session with MongoDB store
- **Validation**: Zod schema validation
- **File Upload**: Multer for photo uploads
- **Frontend**: EJS templates + CSS
- **Security**: Bcrypt password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Form-Zod-Multer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/your_database_name
   SESSION_SECRET=your-super-secret-session-key-here
   PORT=3000
   ```

4. **Database Setup**
   - Start MongoDB service
   - Create a database (or it will be created automatically on first run)

5. **Start the application**
   ```bash
   # Production
   npm start
   
   # Development (with auto-restart)
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
Form-Zod-Multer/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── routes/                # Route definitions
│   ├── auth.js           # Authentication routes
│   └── dashboard.js      # Dashboard and profile routes
├── controllers/           # Business logic
│   ├── authControllers.js    # Authentication logic
│   └── dashboardControllers.js # Dashboard and profile logic
├── models/                # Database schemas
│   └── User.js           # User model
├── views/                 # EJS templates
│   ├── login.ejs         # Login page
│   ├── signup.ejs        # Signup page
│   ├── dashboard.ejs     # Dashboard page
│   ├── profile.ejs       # Profile page
│   └── partials/         # Reusable components
│       └── navbar.ejs    # Navigation bar
├── public/                # Static assets
│   └── css/              # Stylesheets
│       ├── style.css     # General styles
│       ├── navbar.css    # Navigation styles
│       ├── dashboard.css # Dashboard styles
│       └── profile.css   # Profile styles
├── shared/                # Shared utilities
│   └── zodSchema.js      # Validation schemas
└── uploads/               # User photo uploads
```

## API Endpoints

### Authentication Routes
- `GET /signup` - Signup page
- `POST /signup` - User registration
- `GET /login` - Login page
- `POST /login` - User authentication
- `GET /logout` - User logout

### Dashboard Routes (Protected)
- `GET /dashboard` - User dashboard with pagination, search, and sorting
- `GET /profile` - User profile page
- `POST /profile/update` - Update profile information
- `POST /profile/delete` - Delete user account

## Usage Examples

### Dashboard with Search and Pagination
```
GET /dashboard?page=1&limit=10&search=john&sortBy=name&sortOrder=asc
```

### Profile Update
```
POST /profile/update
Content-Type: application/x-www-form-urlencoded

name=John Doe&email=john@example.com
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **Session Management**: Secure sessions stored in MongoDB
- **Input Validation**: Zod schema validation for all inputs
- **Authorization**: Users can only access their own data
- **CSRF Protection**: Form-based requests with proper validation

## Customization

### Adding New Fields
1. Update the User model in `models/User.js`
2. Modify validation schemas in `shared/zodSchema.js`
3. Update controllers and views accordingly

### Styling Changes
- Modify CSS files in `public/css/` directory
- Follow the existing naming conventions
- Test responsiveness on different screen sizes

### Database Changes
- Update Mongoose schemas in `models/` directory
- Consider data migration for existing users
- Test thoroughly before deploying

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB service is running
   - Verify connection string in `.env` file
   - Ensure database exists and is accessible

2. **Session Issues**
   - Verify `SESSION_SECRET` is set in `.env`
   - Check MongoDB connection for session storage
   - Clear browser cookies if testing locally

3. **Photo Upload Issues**
   - Ensure `uploads/` directory exists and is writable
   - Check file size limits in multer configuration
   - Verify file type restrictions

### Debug Mode
Enable debug logging by setting environment variables:
```bash
DEBUG=express:* npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions or issues:
1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in the repository

---

**Note**: This is a learning project demonstrating best practices for building a complete user management system with Node.js and Express.
