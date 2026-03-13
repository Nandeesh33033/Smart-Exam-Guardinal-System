# Exam Guardrail System – Integrity First Online Exam Monitoring Platform

Production-ready full-stack system with:
- **Sentinel Client** (student exam monitor)
- **Auditor Dashboard** (admin behavior analytics)
- **Violation ingestion + trust scoring backend**

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Framer Motion, Socket.io client, TensorFlow.js/MediaPipe hooks, Chart.js, WebRTC
- Backend: Node.js, Express, Socket.io, MongoDB (Atlas/local), JWT, Helmet, rate limiting
- Deployment: Docker, Nginx, Vercel/Render/AWS compatible

## Architecture
Student Browser → Sentinel Monitoring Engine → Violation Logger API → Backend → MongoDB → Trust Score Analyzer → Auditor Dashboard

## Folder Structure
```text
exam-guardrail-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── docker/nginx/default.conf
├── docker-compose.yml
└── .env.example
```

## Core Sentinel Features
- Tab switch tracking (`visibilitychange`)
- Window resize rule (<80% width)
- Keyboard hijack/copy-paste/right-click blocking
- Idle detector (60s)
- Fullscreen lock monitoring
- Per-session randomized question order
- Question blur-until-hover rendering
- WebRTC camera + microphone stream monitoring
- AI-ready placeholders for face/head/lip/object detection pipeline
- Violation webhook API logging in real time

## Backend Features
- JWT auth (student/auditor/admin)
- Exam session start/complete APIs
- Violation ingestion API with Socket.io broadcasts
- Trust score engine with weighted penalties
- Auditor overview endpoint for charts/tables/timelines

## Trust Score Algorithm
Initial score: **100**

Penalties:
- TAB_SWITCH -15
- WINDOW_RESIZE -10
- COPY_ATTEMPT -20
- IDLE_DETECTED -5
- MULTIPLE_FACES -30
- VOICE_DETECTED -20
- LOOKING_AWAY -10
- FULLSCREEN_EXIT -15

Score = `max(0, 100 - total_penalties)`

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/exam/sessions/start`
- `POST /api/exam/sessions/:sessionId/complete`
- `GET /api/exam/auditor/overview`
- `GET /api/exam/sessions/:sessionId/violations`
- `POST /api/violations`

## Environment Variables
Copy `.env.example` to `.env`.

Required:
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`

Optional:
- `GOOGLE_MAPS_API_KEY`

## Local Run
```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Docker Run
```bash
docker compose up --build
```

## Deployment Guide
### Frontend (Vercel)
1. Set project root to `frontend`
2. Build command: `npm run build`
3. Output: `dist`
4. Add env: `VITE_API_BASE_URL`, `VITE_SOCKET_URL`

### Backend (Render/AWS)
1. Deploy `backend` as Node service
2. Start command: `npm start`
3. Add env: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`
4. Allow WebSocket upgrades for Socket.io

### MongoDB Atlas
1. Create cluster + DB user
2. Whitelist backend egress IP or `0.0.0.0/0` temporarily
3. Use Atlas URI in `MONGO_URI`

## Seed Users
Use `POST /api/auth/register` to create:
- Student account (role: `student`, with `studentID`)
- Auditor account (role: `auditor`)

## Security Controls
- Helmet hardening
- API rate limiting
- JWT protected routes + role checks
- Minimal metadata fingerprinting
- Client-side anti-copy/inspect shortcuts

## Notes for AI Modules
- Camera monitor includes signal hooks and violation emitters.
- Replace random face simulation with MediaPipe FaceMesh + object detection model inference loop for production CV tuning.
