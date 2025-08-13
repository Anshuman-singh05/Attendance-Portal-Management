# Full-Stack Attendance Portal with Geofencing & Face Recognition

An enterprise-grade attendance and leave management system built with the MERN stack. This application leverages advanced security features like face recognition and geofencing to automate and secure employee attendance tracking and leave management.

---

## 🚀 Features

### Employee
- **Secure Authentication:** Register and login with email/password.
- **Face Recognition Login:** Password-less login using webcam-based face recognition.
- **Multiple Punch In/Out:** Punch in/out multiple times a day with geofence validation.
- **Attendance History:** View detailed attendance and leave history.
- **Leave Application:** Apply for leaves and track their approval status.
- **Profile Management:** Update profile details, including Date of Birth (with validation) and face data registration.

### Admin
- **Role-Based Access Control:** Secure admin panel accessible only by admins.
- **Dashboards:** Centralized view of all employee attendance and leave requests.
- **User Management:** Edit user details (DOB, roles), and delete users.
- **Leave Management:** Approve or reject leave requests.
- **Geofence Management:** Create and manage office locations (geofences) with names, coordinates, and radii; assign geofences to users; set default geofence policies.

---

## 🔐 Security & Auditing
- JWT authentication with HTTP-only cookies for secure sessions.
- Geofencing validation to restrict punch-in/out and face login to assigned locations.
- Logs IP address, location, and device details on every successful face login for auditing.

---

## 🛠 Tech Stack
- **Frontend:** React.js, React Bootstrap, Zustand, face-api.js, react-toastify, Axios
- **Backend:** Node.js, Express.js, bcrypt.js, JWT Authentication
- **Database:** MongoDB, Mongoose
- **Routing:** React Router

---

## 💻 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB database


👨‍💻 Developed By-
Anshuman Singh

