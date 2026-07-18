# theatre

Cinema Pro Max — a premium movie ticket booking platform.

## Stack
- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS + Framer Motion + Three.js
- **Backend:** Node.js + Express + TypeScript + Prisma
- **Database:** PostgreSQL (+ Redis cache)

## Getting started
```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev
```

Or run the full stack with Docker:
```bash
docker compose -f docker/docker-compose.yml up --build
```

## Structure
- `frontend/` — customer web app + admin dashboard
- `backend/`  — REST API, Prisma schema, auth
- `docker/`   — container stack
- `docs/`     — architecture, governance & program documentation
