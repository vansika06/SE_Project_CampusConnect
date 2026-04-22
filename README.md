# 📚 StudySync — Campus Study Group & Collaboration Platform

> A full-stack real-time web application that allows campus students to create study groups, collaborate via live chat, share files, and schedule study sessions. Built for **SRS #12 — Software Engineering Lab**.

![StudySync Banner](https://img.shields.io/badge/StudySync-Campus%20Collaboration-7c5cfc?style=for-the-badge&logo=bookstack&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io&logoColor=white)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Multi-Device Access (Same WiFi)](#multi-device-access-same-wifi)
- [SRS Requirements Mapping](#srs-requirements-mapping)

---

## Overview

StudySync is a centralized campus collaboration platform that solves the problem of fragmented student communication. Students can discover and join subject-specific study groups, communicate in real-time via Socket.IO powered chat, upload and share study materials, and coordinate group sessions — all in one place.

Administrators have a dedicated dashboard to monitor platform activity and moderate content.

---

## Features

### 👤 Student Features
- ✅ Register and login with JWT-based authentication
- ✅ Browse, search, create, and join study groups
- ✅ Real-time group chat powered by Socket.IO
- ✅ Messages persist across page reloads (saved in MongoDB)
- ✅ Upload and download shared files and notes
- ✅ Schedule study sessions with date, time, location, and duration
- ✅ Typing indicators in live chat
- ✅ View group members and shared files in group detail panel

### 🛠 Admin Features
- ✅ Dedicated admin dashboard (separate from student UI)
- ✅ Platform statistics — total users, groups, messages, sessions
- ✅ View and delete any study group
- ✅ View and delete inappropriate messages

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | Vanilla CSS — Dark glassmorphism theme |
| **Real-time** | Socket.IO |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **File Upload** | Multer (local disk storage) |
| **Routing** | React Router DOM v6 |
| **HTTP Client** | Axios |

---

## Project Structure

```
studysync/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express + Socket.IO entry point
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT verifyToken + isAdmin
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Group.js
│   │   │   ├── Message.js
│   │   │   └── Session.js
│   │   └── routes/
│   │       ├── auth.js            # Register + Login
│   │       ├── groups.js          # CRUD + Join/Leave
│   │       ├── sessions.js        # Schedule sessions
│   │       ├── files.js           # File upload (Multer)
│   │       ├── messages.js        # Fetch chat history
│   │       └── admin.js           # Admin-only routes
│   ├── uploads/                   # Uploaded files stored here
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx                # Routes + auth guards
    │   ├── main.jsx
    │   ├── index.css              # Full design system
    │   ├── api/
    │   │   └── axios.js           # Axios instance + JWT interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── components/
    │   │   └── Navbar.jsx         # Role-aware navigation
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Dashboard.jsx
    │       ├── Groups.jsx
    │       ├── GroupDetail.jsx    # Chat + files + sessions
    │       ├── Sessions.jsx
    │       └── AdminDashboard.jsx
    ├── index.html
    ├── vite.config.js
    ├── .env
    └── package.json
```

---

## Prerequisites

Make sure the following are installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| MongoDB | v6+ | https://www.mongodb.com/try/download/community |
| Git | Any | https://git-scm.com |

Verify installations:
```bash
node -v
mongod --version
npm -v
```

---

## Installation & Setup

### 1. Clone or Download the Project

```bash
# If using git
git clone <your-repo-url>
cd studysync

# Or navigate to the project folder
cd "c:\Study\Projects\software lab project\studysync"
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Create the Uploads Folder

```bash
mkdir uploads
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### `backend/.env`
```env
MONGO_URI=mongodb://localhost:27017/studysync
JWT_SECRET=studysync_super_secret_jwt_key_2024
PORT=5000
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

> **For network/WiFi access** — replace `localhost` with your machine's local IP address (e.g., `192.168.1.105`). Find your IP with `ipconfig` on Windows.

---

## Running the App

Open **3 separate terminals** and run:

### Terminal 1 — Start MongoDB
```bash
mongod
```

### Terminal 2 — Start Backend
```bash
cd backend
npm run dev
```
✅ Expected output: `Server running on port 5000`

### Terminal 3 — Start Frontend
```bash
cd frontend
npm run dev
```
✅ Expected output: `Local: http://localhost:5173`

Open **http://localhost:5173** in your browser.

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login + get JWT | ❌ |

### Groups
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/groups` | Get all groups | ❌ |
| POST | `/api/groups` | Create a group | ✅ |
| POST | `/api/groups/:id/join` | Join a group | ✅ |
| POST | `/api/groups/:id/leave` | Leave a group | ✅ |
| DELETE | `/api/groups/:id` | Delete a group | ✅ |

### Messages
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/messages/group/:groupId` | Get chat history | ❌ |

### Sessions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/sessions` | Get all sessions | ❌ |
| GET | `/api/sessions/group/:groupId` | Sessions for a group | ❌ |
| POST | `/api/sessions` | Create session | ✅ |
| DELETE | `/api/sessions/:id` | Delete session | ✅ |

### Files
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/files/upload` | Upload a file | ✅ |
| GET | `/api/files/group/:groupId` | List group files | ❌ |

### Admin (Admin JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/groups` | All groups |
| GET | `/api/admin/messages` | All messages |
| DELETE | `/api/admin/group/:id` | Delete a group |
| DELETE | `/api/admin/message/:id` | Delete a message |

### Socket.IO Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `join_group` | Client → Server | Join a group chat room |
| `send_message` | Client → Server | Send a chat message |
| `receive_message` | Server → Client | Receive a message broadcast |
| `typing` | Client → Server | Notify others of typing |
| `user_typing` | Server → Client | Show typing indicator |

---

## Usage Guide

### As a Student
1. Register at `/register` with role **Student**
2. Login → redirected to **Dashboard**
3. Go to **Groups** → Create or Join a group
4. Click a group → Enter the **Group Chat**
5. Send messages, upload files using 📎 button
6. Go to **Sessions** → Schedule a study session

### As an Admin
1. Register at `/register` with role **Admin**
2. Login → redirected directly to **Admin Dashboard**
3. View platform stats (users, groups, messages, sessions)
4. Switch between **Groups** and **Messages** tabs to moderate
5. Click **Delete** to remove inappropriate content

---

## Multi-Device Access (Same WiFi)

To allow others on the same WiFi to access the app:

**Step 1** — Find your IP:
```bash
ipconfig
# Look for IPv4 Address e.g. 192.168.1.105
```

**Step 2** — Update `frontend/.env`:
```env
VITE_API_URL=http://192.168.1.105:5000/api
VITE_SOCKET_URL=http://192.168.1.105:5000
```

**Step 3** — Restart both servers

**Step 4** — Others open: `http://192.168.1.105:5173` in their browser

> If connection is blocked, allow ports through Windows Firewall:
> ```powershell
> netsh advfirewall firewall add rule name="StudySync" dir=in action=allow protocol=TCP localport=5000,5173
> ```

---

## SRS Requirements Mapping

| SRS #12 Requirement | Implementation | Status |
|--------------------|---------------|--------|
| Create study groups | `POST /api/groups` + Groups page form | ✅ |
| Join existing groups | `POST /api/groups/:id/join` + Join button | ✅ |
| Schedule group study sessions | `POST /api/sessions` + Sessions page | ✅ |
| Share files and notes | Multer upload + `/uploads` folder | ✅ |
| Real-time chat | Socket.IO `send_message` / `receive_message` | ✅ |
| Admin monitor group activities | Admin Dashboard + `/api/admin/groups` | ✅ |
| Admin remove inappropriate content | `DELETE /api/admin/group/:id` and `/message/:id` | ✅ |

---

## 👨‍💻 Developed for

> Software Engineering Lab — SRS #12  
> Campus Study Group & Collaboration Platform
