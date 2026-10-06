# Zelis Hiring Platform

> **AI-Powered Adaptive Technical Recruitment & Assessment Ecosystem**  
> *Dynamic difficulty calibration, real-time telemetry, multi-topic skill diagnostics, and full recruitment pipeline tracking.*

[![MERN Stack](https://img.shields.io/badge/Stack-MERN%20(React%2019%20%2B%20Node%20%2B%20Express%20%2B%20Mongo)-0ea5e9.svg)](#tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38bdf8.svg)](https://tailwindcss.com)
[![Engine Status](https://img.shields.io/badge/Adaptive%20Engine-Active-10b981.svg)](#adaptive-algorithm)
[![AI Integration](https://img.shields.io/badge/AI%20Layer-Modular%20(Gemini%20%2F%20OpenAI)-8b5cf6.svg)](#optional-ai-layer)

---

## 1. Project Overview

The **Zelis Hiring Platform** is an enterprise-grade, full-stack adaptive technical assessment and recruitment platform. Traditional hiring platforms test candidates with static questions of arbitrary, fixed difficulty, measuring memorization rather than actual problem-solving boundaries. 

The Zelis platform introduces a **server-driven adaptive assessment engine** where question difficulty dynamically shifts (Easy ➔ Medium ➔ Hard) in real time in response to candidate correctness, calculating precision skill diagnostics across Data Structures & Algorithms (DSA), SQL, Object-Oriented Programming (OOP), and Database Management Systems (DBMS).

---

## 2. Problem Statement

Standard multiple-choice and coding tests suffer from critical drawbacks:
1. **Static Test Rigidity**: High-performing senior engineers are forced to answer trivial questions, while junior candidates are demoralized by disproportionately difficult questions.
2. **Crude Binary Scoring**: Scoring based only on percentage of correct answers fails to reward candidates who solve complex problems compared to those who only answer easier questions.
3. **Assessment Integrity Deficits**: Lack of real-time telemetry into candidate focus, window blurs, and full-screen continuity.
4. **Disconnected Pipeline**: Recruiter dashboards often lack granular topic diagnostics and configurable weighted rankings to advance candidates through interview stages.

---

## 3. The Zelis Solution

Zelis resolves these recruitment challenges through four integrated pillars:
- **Dynamic Adaptive Difficulty Calibration**: The engine starts every candidate at Easy and scales to Medium and Hard based on demonstrated competence.
- **Intelligent Downgrade Logic**: Rather than penalizing on a single slip, the system only recalibrates downwards after **2 consecutive failures at the same tier**.
- **Granular Multi-Factor Ranking**: Recruiters can dynamically rank candidates via configurable weighted sliders (Assessment Score, Problem Solving, Technical Skills, Accuracy).
- **End-to-End ATS Pipeline**: Seamless workflow tracking from `Applied ➔ Assessment ➔ Shortlisted ➔ L1 Interview ➔ L2 Interview ➔ Selected ➔ Offer`.

---

## 4. Adaptive Algorithm

The core differentiating engine is implemented strictly on the backend (`server/services/adaptiveAssessmentService.js`), maintaining the server as the **single source of truth**.

### Difficulty Marks Formula

| Difficulty Level | Marks Awarded for Correct Answer | Penalty for Incorrect Answer |
| :--- | :--- | :--- |
| **Easy** | **1 Mark** | 0 Marks |
| **Medium** | **2 Marks** | 0 Marks |
| **Hard** | **3 Marks** | 0 Marks |

### Transition Rules

```text
Start Level: EASY
Failure Counter: 0

IF answer is CORRECT:
    Reset failureCount = 0
    IF currentDifficulty == EASY:   nextDifficulty = MEDIUM
    IF currentDifficulty == MEDIUM: nextDifficulty = HARD
    IF currentDifficulty == HARD:   nextDifficulty = HARD (Cap at max difficulty)

IF answer is INCORRECT:
    failureCount += 1
    IF failureCount >= 2:
        IF currentDifficulty == HARD:   nextDifficulty = MEDIUM
        IF currentDifficulty == MEDIUM: nextDifficulty = EASY
        IF currentDifficulty == EASY:   nextDifficulty = EASY (Never drop below Easy)
        Reset failureCount = 0
    ELSE:
        nextDifficulty = currentDifficulty (Maintain level on single failure)
```

### Demonstration Trajectory Example

```text
Q1 (Easy)   ──▶ Correct   ──▶ Difficulty escalates to Medium
Q2 (Medium) ──▶ Correct   ──▶ Difficulty escalates to Hard
Q3 (Hard)   ──▶ Incorrect ──▶ Failure 1 of 2. Difficulty held at Hard
Q4 (Hard)   ──▶ Incorrect ──▶ Failure 2 of 2! Downgrade triggered: Difficulty decreases to Medium
Q5 (Medium) ──▶ Correct   ──▶ Failure counter resets. Difficulty escalates back to Hard
```

Every transition, timestamp, selected choice, and time taken is durably stored in the `QuestionAttempt` collection and visualized on the candidate result report via **Recharts**.

---

## 5. System Architecture

```text
 zeliss-hiring-platform/
 ├── client/                         # Modern React 19 Frontend (Vite + Tailwind CSS)
 │   ├── src/
 │   │   ├── api/                    # Axios client with JWT auto-injection & 401 interceptor
 │   │   ├── components/
 │   │   │   ├── assessment/         # Distraction-free test screen, Timer, Anti-cheat modal
 │   │   │   └── common/             # Navbar, Footer, Badges, Modals, Protected routes
 │   │   ├── context/                # AuthContext (JWT, session persistence, role state)
 │   │   ├── pages/
 │   │   │   ├── candidate/          # Dashboard, Tests, Instructions, Live Screen, Results
 │   │   │   ├── recruiter/          # Executive Hub, Leaderboard, Details, Pipeline, AI Gen
 │   │   │   └── public/             # Landing, Interactive Simulator, Login, Register, About
 │   │   ├── index.css               # Tailwind CSS base, utilities, and glassmorphism
 │   │   └── App.jsx                 # Full client routing & role-based route guards
 │   └── package.json
 │
 ├── server/                         # Express.js REST API Backend
 │   ├── config/                     # MongoDB connection with In-Memory fallback option
 │   ├── controllers/                # Auth, Assessment, Attempt, Question, Recruiter
 │   ├── middleware/                 # JWT verification, Role authorization, Error handler
 │   ├── models/                     # User, Profile, Assessment, Question, Attempt, Application
 │   ├── routes/                     # Clean REST endpoints mounted on Express
 │   ├── seed/                       # 120-question database seeder (DSA, SQL, OOP, DBMS)
 │   ├── services/
 │   │   ├── adaptiveAssessmentService.js # Core State Machine & Metrics Engine
 │   │   └── aiService.js            # Modular Gemini / OpenAI / Algorithmic Generator
 │   ├── server.js                   # Application bootstrap & healthcheck
 │   └── package.json
 │
 ├── .env.example                    # Environment template
 └── package.json                    # Root package orchestration
```

---

## 6. Tech Stack

### Frontend
- **React 19** & **Vite**: Ultra-fast component rendering and hot module reloading.
- **Tailwind CSS 3.4**: Clean, modern dark-themed SaaS aesthetic with glassmorphism.
- **React Router DOM 7**: Declarative routing with client-side RBAC protection.
- **Recharts 2.15**: Interactive SVG charts (Progression Line Charts, Skill Bar Charts).
- **Lucide React**: Crisp iconography.
- **Axios**: HTTP client with request and response interceptors.
- **Canvas-Confetti**: Assessment completion celebrations.

### Backend
- **Node.js** & **Express.js**: High-throughput REST API architecture.
- **MongoDB** & **Mongoose**: Flexible document persistence and indexing.
- **JSON Web Tokens (JWT)**: Stateless authorization with role claims.
- **bcryptjs**: Salted password hashing.
- **Morgan**: HTTP request logging.

### Optional AI Layer
- Modular `aiService.js` supporting **Google Gemini API** (`gemini-1.5-flash`), **OpenAI API** (`gpt-4o-mini`), or our built-in **algorithmic generator fallback** when no API keys are provided.
- **Never exposes API keys to the browser**; all AI synthesis happens on backend routes.

---

## 7. Database Models

1. **User**: Name, email, hashed password, role (`candidate` | `recruiter` | `admin`), title.
2. **CandidateProfile**: Bio, headline, phone, location, skills array, resume URL, GitHub, LinkedIn.
3. **Question**: Text, type (`mcq`), options array, `correctAnswer`, topic (`DSA` | `SQL` | `OOP` | `DBMS`), difficulty (`easy` | `medium` | `hard`), marks, explanation, tags.
4. **Assessment**: Title, description, duration in minutes, evaluated topics, question count, passing score, difficulty configuration.
5. **AssessmentAttempt**: Candidate ref, startedAt, submittedAt, currentDifficulty, failureCount, totalScore, accuracy, highestDifficulty, tabSwitchCount, suspicious events log, cached skill analysis.
6. **QuestionAttempt**: Attempt ref, question ref, questionNumber, difficulty, selectedAnswer, isCorrect, marksAwarded, timeTakenSeconds, transition metadata (`transitionFrom`, `transitionTo`, `failureCountAfter`).
7. **Application**: Candidate ref, assessment ref, jobTitle, status (`Applied` ➔ `Assessment` ➔ `Shortlisted` ➔ `L1 Interview` ➔ `L2 Interview` ➔ `Selected` ➔ `Offer` ➔ `Rejected`), assessment score, recommendation, status history audit trail.

---

## 8. REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Create user account & candidate profile.
- `POST /api/auth/login`: Authenticate and issue Bearer JWT.
- `GET /api/auth/me`: Get current logged-in user profile.
- `PUT /api/auth/profile`: Update candidate skills, resume link, and bio.

### Assessment Attempts (`/api/attempts`)
- `POST /api/attempts/start/:assessmentId`: Start or resume an adaptive test attempt.
- `GET /api/attempts/:attemptId/current-question`: Fetch current active question (sanitized without leaking the answer).
- `POST /api/attempts/:attemptId/answer`: Submit answer, execute adaptive calibration, and receive transition outcome.
- `POST /api/attempts/:attemptId/submit`: Complete and seal assessment.
- `GET /api/attempts/:attemptId/result`: Retrieve full analytical report, difficulty progression curve, and answer review.
- `POST /api/attempts/:attemptId/telemetry`: Record integrity events (tab switch, window blur).

### Recruiter Hub (`/api/recruiters`)
- `GET /api/recruiters/dashboard`: Aggregate KPI metrics and charts data.
- `GET /api/recruiters/candidates`: Candidate leaderboard with dynamic weighted scoring parameters.
- `GET /api/recruiters/candidates/:id`: Candidate deep dive, resume, and test attempt review.
- `PATCH /api/recruiters/applications/:id/status`: Transition candidate recruitment stage.

### Question Bank & AI (`/api/questions`)
- `GET /api/questions`: Filterable question bank list with search and pagination.
- `POST /api/questions`: Create a new technical question.
- `DELETE /api/questions/:id`: Remove question from question bank.
- `POST /api/questions/ai-generate`: Prompt backend AI service to generate MCQ questions by topic and difficulty.

---

## 9. Installation & Running Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or cloud MongoDB Atlas URI)

### Quick Start

1. **Clone or enter the project directory**:
   ```bash
   cd zelis-hiring-platform
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in the `server` directory (or use default configuration):
   ```bash
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/zelis_hiring
   JWT_SECRET=zelis_super_secret_jwt_key_2026_adaptive_platform
   AI_API_KEY=
   AI_MODEL=gemini-1.5-flash
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

4. **Seed Database (120+ Curated Questions across DSA, SQL, OOP, DBMS)**:
   ```bash
   npm run seed
   ```

5. **Start Both Server & Client**:
   In two separate terminals:
   ```bash
   # Terminal 1 - Backend Server (Port 5000)
   npm run server

   # Terminal 2 - Frontend Client (Port 5173)
   npm run client
   ```

   Visit **`http://localhost:5173`** in your browser!

---

## 10. Demo Credentials

Use any of the seeded accounts with password: **`Password123!`**

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@example.com` | `Password123!` | Take adaptive tests, view progression curve, profile & resume |
| **Recruiter** | `recruiter@example.com` | `Password123!` | Leaderboard, configurable weighted sliders, pipeline Kanban |
| **System Admin** | `admin@example.com` | `Password123!` | AI Question Generator, Question Bank CRUD, platform ops |

> **Pro Tip**: Use the **"Demo Persona"** dropdown in the top navbar or the **"1-Click Demo Fill"** chips on the login page to switch between Candidate, Recruiter, and Admin personas with a single click!

---

## 11. Security & Anti-Cheating Telemetry

The platform incorporates multi-tiered assessment integrity mechanisms:
- **Server-Side Evaluation**: Correct answers and technical explanations are never sent to the browser during the active test. The backend alone verifies answers.
- **Fullscreen Mode Enforcement**: Fullscreen is requested upon test initialization. Exiting fullscreen triggers telemetry recording.
- **Tab Visibility Tracking**: Browser `document.hidden` and window blur events trigger real-time integrity incident logs and warning modals.
- **Countdown Timer Synchronization**: Auto-submits attempts when the duration expires.
- **Anti-Tampering Guards**: Compound database indexes prevent duplicate submissions for the same question attempt.

---

## 12. Future Enhancements

- **Real-Time Coding Judge**: Sandboxed code execution engine (Dockerized isolate) for live algorithmic coding challenges.
- **Automated Resume Parsing**: AI-powered resume extractor matching candidate skill profiles against job requirements.
- **AI Asynchronous Video/Voice Interviews**: Interactive conversational AI evaluating behavioral and technical competencies.
- **Automated Proctoring with Webcam Gaze Tracking**: Client-side face detection evaluating eye gaze divergence and multi-person presence.
- **Predictive Hiring Analytics**: Machine learning models predicting candidate on-the-job performance based on historical assessment telemetry.

---

## 13. License

Developed for the **Zelis Healthcare Recruitment Engineering Team**. Released under the MIT License.
