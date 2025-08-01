🌿 Arvyax Wellness Session Platform

A secure full-stack web application that allows users to create, manage, and explore wellness sessions like yoga and meditation — featuring drafts, publishing, and auto-save capabilities.

live demo:https://serenity-flow-fullstack-2.onrender.com
---

🎯 Objectives

Secure user registration and login with JWT

View public wellness sessions

Create, edit, and publish personal wellness sessions

Auto-save session drafts during editing



---

💻 Tech Stack

Frontend

⚛️ React.js

🎨 Tailwind CSS (optional)

🔁 React Router

🍪 LocalStorage (for JWT handling)


Backend

🟢 Node.js + Express.js


Database

🍃 MongoDB (Atlas preferred)

📖 Mongoose


Authentication

🔐 JWT + bcrypt



---

✨ Features

🔐 Authentication

POST /register – Register a new user (with password hashing)

POST /login – Login and receive JWT

JWT stored securely in localStorage or cookies

Protected routes via JWT middleware


📘 Session Management API

Method	Endpoint	Description

GET	/sessions	View all public sessions
GET	/my-sessions	View user's draft & published
GET	/my-sessions/:id	View specific session
POST	/my-sessions/save-draft	Save or update a draft
POST	/my-sessions/publish	Publish a session


🧘 Frontend Pages

Login/Register – Auth forms and token storage

Dashboard – View all published sessions

My Sessions – View, edit, and manage drafts & published content

Session Editor – Create/edit sessions with:

Title

Tags (comma-separated)

JSON File URL (as text)

Auto-save after 5 seconds of inactivity

Buttons: “Save as Draft” & “Publish”




---

🗃️ Database Schema

🧑‍💼 User

{
  _id,
  email,
  password_hash,
  created_at
}

🧘 Session

{
  _id,
  user_id: ObjectId,
  title: String,
  tags: [String],
  json_file_url: String,
  status: "draft" | "published",
  created_at,
  updated_at
}

📂 Project Structure

/wellness-platform
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── App.js
    │   └── index.js
    
