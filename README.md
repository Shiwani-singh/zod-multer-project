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

