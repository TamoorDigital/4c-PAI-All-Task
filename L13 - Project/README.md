# 🧠 AI Study Assistant

A full-stack AI-powered study assistant that extracts text from PDFs and images using OCR, then generates MCQs, short questions, and long questions using Google Gemini AI.

---

## 📂 Project Structure

```
ai-study-assistant/
├── backend/
│   ├── main.py                   # FastAPI app entry point
│   ├── database.py               # SQLAlchemy setup
│   ├── models.py                 # DB models (User, Upload, Generation)
│   ├── auth.py                   # JWT auth helpers
│   ├── config.py                 # Settings & plan limits
│   ├── routes/
│   │   ├── auth_routes.py        # /signup, /login, /me
│   │   ├── upload_routes.py      # /upload, /uploads
│   │   ├── generate_routes.py    # /generate-mcq, /generate-short, /generate-long
│   │   ├── plan_routes.py        # /user-plan, /change-plan
│   │   └── admin_routes.py       # /admin/* routes
│   ├── services/
│   │   ├── ocr.py                # OpenCV + Tesseract OCR
│   │   ├── pdf.py                # PyMuPDF text extraction
│   │   ├── cleaning.py           # NLP text cleaning
│   │   └── llm.py                # Gemini API integration
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page with plans
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Generator.jsx     # Main AI generation UI
│   │   │   ├── History.jsx       # Past generations
│   │   │   ├── Plans.jsx         # Pricing page
│   │   │   └── AdminPanel.jsx    # Admin management
│   │   ├── components/
│   │   │   └── Layout.jsx        # Sidebar layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state
│   │   ├── hooks/
│   │   │   └── useApi.js         # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## 🔑 Getting Your FREE Grok API Key

1. Click **"Get API key"** in the left sidebar
2. Click **"Create API key"**
3. Copy the generated key
4. Paste it into your backend `.env` file as `GEMINI_API_KEY=your_key_here`



---

## ⚙️ Backend Setup

### 1. Navigate to backend folder
```bash
cd ai-study-assistant/backend
```

### 2. Create virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Install Tesseract OCR

**Windows:**
- Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
- Run the installer
- Add Tesseract to PATH (default: `C:\Program Files\Tesseract-OCR`)
- Restart terminal

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install tesseract-ocr -y
```

**Mac:**
```bash
brew install tesseract
```

### 5. Create `.env` file
```bash
cp .env.example .env
```

Edit `.env`:
```
SECRET_KEY=your-super-secret-jwt-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./study_assistant.db
```

### 6. Run the backend server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at: **http://localhost:8000/docs**

---

## 🎨 Frontend Setup

### 1. Navigate to frontend folder
```bash
cd ai-study-assistant/frontend
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

App available at: **http://localhost:5173**

---

## 👤 Creating an Admin User

After starting the backend, you can make a user admin by modifying the database:

```bash
cd backend
python -c "
from database import SessionLocal
from models import User
db = SessionLocal()
user = db.query(User).filter(User.email == 'webtamoor12@gmail.com').first()
if user:
    user.is_admin = True
    db.commit()
    print('Admin set!')
else:
    print('User not found')
db.close()
"
```

Or sign up first via the UI, then run the script above with your email.

---

## 💳 Plan Limits

| Feature          | Free   | Basic ($5) | Advanced ($15) |
|------------------|--------|------------|----------------|
| Uploads/day      | 5      | 20         | 50             |
| Files at once    | 1      | 3          | 10             |
| MCQs             | 20     | 50         | 300            |
| Short Questions  | 10     | 25         | 75             |
| Long Questions   | 5      | 10         | 25             |

---

## 🔌 API Endpoints

### Auth
- `POST /signup` — Register new user
- `POST /login` — Login, get JWT token
- `GET /me` — Get current user info

### Upload
- `POST /upload` — Upload PDF or image, extract text
- `GET /uploads` — List user's uploads
- `GET /uploads/{id}` — Get upload details

### Generate
- `POST /generate-mcq` — Generate MCQs
- `POST /generate-short` — Generate short questions
- `POST /generate-long` — Generate long questions
- `GET /generations` — List generations
- `GET /generations/{id}` — Get generation with full data

### Plans
- `GET /user-plan` — Get current plan info
- `POST /change-plan` — Change plan

### Admin
- `GET /admin/users` — List all users
- `POST /admin/delete-user` — Deactivate user
- `POST /admin/change-plan` — Change user's plan
- `GET /admin/stats` — Platform statistics

---

## 🛠️ Tech Stack

**Backend:** FastAPI, SQLAlchemy, SQLite, JWT (python-jose), passlib  
**AI:** Google Gemini 1.5 Flash, PyMuPDF, OpenCV, pytesseract  
**Frontend:** React 18, React Router, Tailwind CSS, Axios, Lucide Icons  
**Build Tool:** Vite

---

## 📝 Notes

- For production, change `SECRET_KEY` to a strong random value
- Use PostgreSQL instead of SQLite by setting `DATABASE_URL` in `.env`
- The upload directory is created automatically at `backend/uploads/`
- Gemini API has generous free tier limits (15 RPM, 1M tokens/day on free tier)
