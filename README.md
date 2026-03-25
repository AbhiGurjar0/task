# GRED – Learning Platform Backend

Backend system for a learning platform where instructors create courses, students enroll and track progress module by module, and admins can monitor all data through a set of APIs.

Built with Node.js, Express, and MongoDB.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Config:** dotenv

---

## Features

- User registration and login with JWT authentication
- Role-based access control (Student, Instructor, Admin)
- Instructors can create courses and add modules
- Students can enroll in courses
- Module-by-module progress tracking with completion percentage
- Course completion history stored via Progress collection
- Admin APIs to view all users, courses, enrollments, and progress

---

## Project Structure
```
backend/
  models/
    User.js
    Course.js
    Module.js
    Enrollment.js
    Progress.js
  routes/
    student.js
    instructor.js
    admin.js
  middleware/
    isLoggedIn.js
    isAuthorized.js
  controllers/
    authController.js
  server.js
  .env
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation
```bash
git clone https://github.com/AbhiGurjar0/task.git
cd task/backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run
```bash
# development
npm run dev

# production
npm start
```

---

## API Reference

### Auth

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login and get JWT token | Public |

### Courses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/courses` | Create a new course | Instructor |
| GET | `/courses` | Get all courses | Public |
| GET | `/courses/:id` | Get course with modules | Public |

### Modules

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/modules` | Add module to a course | Instructor |

### Enrollment

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/enroll` | Enroll in a course | Student |
| GET | `/my-courses` | Get enrolled courses | Student |

### Progress

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/progress/update` | Mark module as completed | Student |
| GET | `/progress/:courseId` | Get progress for a course | Student |

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/admin/users` | Get all users | Admin |
| GET | `/admin/courses` | Get all courses with stats | Admin |
| GET | `/admin/enrollments` | Get all enrollments | Admin |
| GET | `/admin/progress` | Get all progress data | Admin |

---

## Database Collections

**User** — stores all users with roles (Student, Instructor, Admin)

**Course** — course metadata created by instructors, references Module IDs

**Module** — individual learning units inside a course, ordered by `orderIndex`

**Enrollment** — links a student to a course with an enrollment timestamp

**Progress** — tracks completed modules, percentage, and completion status per student per course

---

## Auth Flow

All protected routes require the JWT token in the request header:
```
Authorization: Bearer <token>
```

Middleware `verifyToken` validates the token and `authorizeRole` checks if the user's role is allowed for that route.

---

## Progress Calculation

When a student marks a module complete, the backend:

1. Adds the module to `completedModules` (using `$addToSet` to avoid duplicates)
2. Fetches total module count for the course
3. Calculates `percentage = (completedModules.length / totalModules) * 100`
4. Sets `isCompleted = true` when percentage hits 100
