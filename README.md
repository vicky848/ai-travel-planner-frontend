# ✈️ AI Travel Planner

**Built by Vicky Kumar Chowrasia**

A full-stack web application where users can generate complete AI-powered travel itineraries, estimate budgets, get hotel suggestions, and manage their packing list — all in one place.

---

## 🎯 Project Overview

As a traveler, one of the biggest problems is not knowing **how much a trip will actually cost** before booking anything. I built this app to solve that problem.

When a user enters their destination, number of days, budget type, and interests — the AI instantly generates:
- A **day-by-day itinerary** with activities
- A **complete budget breakdown** (Transport, Accommodation, Food, Activities)
- **Hotel suggestions** based on budget
- A **smart packing list** based on destination and activities

The user knows their total estimated cost **before** spending a single rupee.

---

## Frontend Repository
https://github.com/vicky848/ai-travel-planner-frontend.git

## Backend Repository

https://github.com/vicky848/-ai-travel-planner-backend.git


## Live Demo 

## Backend API : https://ai-travel-planner-backend-b9e5.onrender.com 

## Frontend : https://ai-travel-planner-frontend-93yczkzzl-vicky848s-projects.vercel.app/login


## 🛠️ Tech Stack

| Layer | Technology | Why I Chose It |
|-------|-----------|----------------|
| Frontend | React.js | I have hands-on practice with React. It is the framework I have actually learned and built projects in. I chose it over Next.js because I am more confident writing clean React code. |
| Backend | Node.js + Express | Fast, lightweight, and perfect for REST APIs |
| Database | MongoDB Atlas | Flexible schema — perfect for storing dynamic itinerary structures |
| AI | Google Gemini 2.5 Flash | Free tier available, fast response, returns clean JSON |
| Auth | JWT + bcryptjs | Secure, stateless authentication |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18 or above
- MongoDB Atlas account (free)
- Google AI Studio API Key (free)

### Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/vickykumar/ai-travel-planner.git
cd ai-travel-planner
```

**2. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Start backend:
```bash
npm run dev
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```

App will open at `http://localhost:3000`

### Deployed Application
- **Frontend:** (Vercel URL here)
- **Backend:** (Render URL here)

---

## 🏗️ High-Level Architecture

```
React Frontend (Port 3000)
        |
        | REST API calls with JWT token
        |
Express Backend (Port 5000)
        |
   _____|_____
  |           |
MongoDB     Google Gemini API
(User &     (AI Trip Generation)
Trip Data)
```

**Request Flow:**
1. User logs in → JWT token is issued
2. User submits trip form → Backend receives request
3. Backend sends prompt to Gemini API → AI returns JSON itinerary
4. Backend saves trip to MongoDB under user's ID
5. Frontend displays itinerary, budget, hotels, packing list

---

## 🔐 Authentication & Authorization

- Passwords are **hashed using bcryptjs** before saving to database
- On login/register, a **JWT token** is issued (expires in 7 days)
- Every protected API route checks for `Authorization: Bearer <token>` header
- JWT middleware decodes the token and attaches `req.user.id` to the request
- **Every database query filters by `userId`** — so User A can never see User B's trips
- If no token is provided, API returns `401 Unauthorized`

---

## 🤖 AI Agent Design

**Model Used:** Google Gemini 2.5 Flash

**How it works:**
1. User inputs are combined into a structured prompt
2. Prompt tells the AI to return **only valid JSON** — no extra text
3. The JSON structure matches exactly what MongoDB expects
4. Backend parses the response and saves it directly

**Resilience:**
- Implemented **exponential backoff** retry logic
- If API returns 429 (rate limit), system retries up to 5 times
- Delays: 1s → 2s → 4s → 8s → 16s

**Example Prompt Structure:**
```
Create a 3-day trip to Tokyo with Medium budget.
Interests: Food, Culture.
Return ONLY valid JSON with itinerary, hotels, estimatedBudget, packingList.
```

---

## 🎒 Creative Feature: AI Weather-Aware Packing Assistant

### Why I Built This

When I thought about what travelers actually struggle with — it is not just planning activities, it is **knowing what to pack**. Most people forget important items or pack wrong things for the weather.

### What Problem It Solves

The Packing Assistant uses the trip destination and activities to automatically generate a smart packing checklist divided into categories:
- 📄 Documents (Passport, Visa, etc.)
- 👕 Clothing (based on destination climate)
- 🎒 Gear (based on planned activities)
- 💊 Medicine & Toiletries

### How It Works
- AI analyzes the destination and itinerary activities
- Generates a personalized packing list
- User can **check/uncheck items** as they pack
- Progress bar shows packing completion percentage
- When 100% packed → celebration message appears

This feature gives travelers **peace of mind** before their trip.

---

## ✏️ Key Design Decisions & Trade-offs

| Decision | Reason | Trade-off |
|----------|--------|-----------|
| React over Next.js | I have real hands-on experience with React | Missing SSR benefits |
| Gemini API over OpenAI | Free tier available, no credit card needed | Occasional rate limits |
| MongoDB over SQL | Dynamic itinerary structure changes per trip | Less strict data validation |
| JWT over Sessions | Stateless, works well for REST APIs | Token cannot be revoked before expiry |
| Inline CSS over Tailwind | Faster to write, no config needed | Less maintainable at scale |

---

## ⚠️ Known Limitations

- **No flight booking** — App estimates transport cost but cannot book actual flights
- **No payment system** — Budget is estimated only, no real transactions
- **Gemini free tier rate limits** — Too many requests in short time can cause temporary errors
- **Weather data is AI-estimated** — Not connected to a real-time weather API

---

## 📁 Project Structure

```
ai-travel-planner/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js     # JWT verification
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Trip.js           # Trip & itinerary schema
│   ├── controllers/
│   │   ├── authController.js # Register & Login
│   │   └── tripController.js # AI generation & CRUD
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── tripRoutes.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js       # API client with auth headers
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   └── Dashboard.js
        └── components/
            ├── TripForm.js    # Trip input form
            ├── ItineraryCard.js # Day-by-day editor
            └── PackingList.js # Packing checklist
```

---

## 👨‍💻 Developer

**Vicky Kumar Chowrasia**

Built with React.js, Node.js, MongoDB, and Google Gemini AI.