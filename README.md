# 🎓 CampusConnect – Student Feedback & Engagement Platform

**CampusConnect** is a full-stack web application that enables students to raise their voices, share their experiences, and help build a better college ecosystem. Through a unified platform for feedback submission, students can communicate concerns, suggestions, or appreciation—while admins gain insights to improve campus life.

---

## 🚀 Features

- 📝 Submit feedback on clubs, events, faculty, or general concerns
- 👀 Public viewing of all submitted feedback without login
- 🔍 Advanced filtering by category and full-text search
- 🙈 Option to submit feedback anonymously
- 📊 Real-time analytics:
  - Total users joined
  - Total feedbacks submitted
  - Category-wise feedback charts
- 🔐 Secure user authentication with JWT
- 🛠️ Admin dashboard to review and delete feedback when necessary
- 👥 Role-based sign-up for **Student** and **Admin**

---

## 🧰 Tech Stack

| Layer      | Tech Used                          |
|------------|------------------------------------|
| **Frontend** | React.js, Tailwind CSS v4, React Router |
| **Backend**  | FastAPI, PyMongo, Pydantic        |
| **Database** | MongoDB (Cloud/Local)             |
| **Auth**     | JWT (JSON Web Tokens)             |

---

## 📁 Project Structure

```
CampusConnect/
├── backend/ # FastAPI backend
│ ├── routers/ # Routes for auth, feedback, analytics, admin
│ ├── models/ # Pydantic schemas for validation
│ ├── utils/ # JWT helpers, database ops
│ ├── main.py # App entry and DB connection
│ └── requirements.txt
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # UI elements (forms, charts, navbar, etc.)
│ │ ├── pages/ # Auth, Home, Dashboard, Feedback screens
│ │ ├── services/ # API integration logic
│ │ └── App.jsx # Route definitions and layout
│ └── package.json
```

---

## 🛠️ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/kalpanaG2004/CampusConnect.git
cd CampusConnect
```
### 2️⃣ Backend Setup
```
cd backend
python3 -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a .env file inside /backend:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_secret_key
```

Run the backend:
```
uvicorn main:app --reload
```

### 3️⃣ Frontend Setup
```
cd ../frontend
npm install
npm run dev
```

By default:

Frontend runs at: http://localhost:5173

Backend API at: http://localhost:8000

---

## 🧪 Current Functionality

### 🔐 Authentication
- Register/login using JWT-based system
- Local storage token handling
- Two user roles: **Student** and **Admin**
  - Student: No document verification (planned)
  - Admin: Must enter a valid **Admin Code** (stored securely in `.env`)

### 📝 Feedback Management
- Authenticated users can submit feedback under defined categories
- Optional toggle to submit anonymously
- Public users can browse all feedback (no login required)
- Real-time stats on homepage:
  - Total feedback count
  - Total user count
- Admin dashboard:
  - View all feedback
  - Delete inappropriate/irrelevant feedback

### 🔍 Filtering & Search
- Anyone can:
  - Filter feedback by category
  - Search by keyword or topic

---

## 🌐 Deployment Info

- ✅ **Frontend deployed at:** [https://campusconnect-1-jy1a.onrender.com](https://campusconnect-1-jy1a.onrender.com)
- ✅ **Backend API hosted at:** [https://campusconnect-ks07.onrender.com](https://campusconnect-ks07.onrender.com)

---

## 🌱 Future Enhancements

- ✉️ Email and push notifications on submission or response
- 🧑‍💼 Enhanced role-based dashboards for students, admins, and staff
- 📊 Graphical feedback visualizations over time (weekly/monthly trends)
- 🧾 CSV export of feedback reports for admins
- 📥 Preview and file attachments in feedback
- 🌐 Support for multiple departments/campuses
- 🧠 AI-generated feedback summaries
- 📎 Student ID-based sign-up validation

---

## 👩‍💻 Author

**Kalpana Gupta**  
🔗 [GitHub](https://github.com/kalpanaG2004)  
🔗 [LinkedIn](https://linkedin.com/in/kalpana-gupta-214526315)

---

## 📜 License

This project is open source under the [MIT License](LICENSE)

---
