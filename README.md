# SmartCampus — Smart Campus Management Platform

SmartCampus is a complete, production-ready, full-stack campus management platform built for DevFusion 4.O. It brings together Students, Faculty, Coordinators, and Administrators into a unified digital ecosystem.

![SmartCampus Platform Banner](https://raw.githubusercontent.com/smartcampus/smartcampus/main/docs/banner.png)

## Core Capabilities

- **Authentication & RBAC**: HTTP-only secure cookie sessions, JWT verification, Google OAuth flow, Email verification, Forgot/Reset Password, server-side RBAC authorization for 4 roles (`STUDENT`, `FACULTY`, `COORDINATOR`, `ADMIN`).
- **Attendance Management**: Faculty attendance session creation, QR token session validation, student marking (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`), low-attendance (<75%) warnings, subject breakdown.
- **Assignments & Rubrics**: Faculty assignment publishing with rubrics and max marks, student PDF/ZIP file submission + GitHub link, late submission detection, faculty grading & feedback.
- **Event Management & Ticketing**: Coordinator event creation with seat limits, speaker rosters, duplicate registration protection, digital QR pass generation.
- **Placement Portal**: Company drive listings with CTC and eligibility criteria, resume upload, real-time application status tracking (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).
- **Clubs & Announcements**: Student club discovery, coordinator membership approvals, targeted announcements by role and department.
- **Realtime Notifications**: Socket.IO push alerts for assignment deadlines, graded work, attendance warnings, event registration, and system updates.
- **Analytics & Admin Panel**: Interactive Recharts statistics, department performance metrics, complete User CRUD, role assignment, audit logs, CSV/Excel report exporting.

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, React Router v6, TanStack Query v5, React Hook Form, Zod, Recharts.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Socket.IO, Swagger UI, Helmet, CORS, Express Rate Limit, Multer.
- **Database**: PostgreSQL 16.
- **Testing**: Vitest + Supertest integration testing suite against PostgreSQL.
- **DevOps**: Docker, Docker Compose, GitHub Actions CI.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js >= 18.x
- Docker & Docker Compose (or local PostgreSQL 16)

### 1. Configure Environment Variables
```bash
cp .env.example .env
```

### 2. Start PostgreSQL via Docker Compose
```bash
docker-compose up postgres -d
```

### 3. Install Dependencies across Monorepo
```bash
npm install
```

### 4. Run Prisma Database Migrations & Seed Data
```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Frontend and Backend Concurrent Dev Servers
```bash
npm run dev
```
- Frontend Web App: `http://localhost:5173`
- Backend REST API: `http://localhost:5000`
- Interactive Swagger OpenAPI Docs: `http://localhost:5000/api/docs`

---

## Demo Login Credentials

All demo accounts share the password: `Password123!`

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@smartcampus.demo` | `Password123!` |
| **Coordinator** | `coordinator@smartcampus.demo` | `Password123!` |
| **Faculty** | `faculty@smartcampus.demo` | `Password123!` |
| **Student** | `student@smartcampus.demo` | `Password123!` |

---

## Running Automated Integration Tests

```bash
npm run test
```

## Production Build

```bash
npm run build
```

---

## Documentation Links
- [Architecture Documentation](file:///c:/Users/sridharan/Downloads/Dev-4/docs/architecture.md)
- [Database Schema Documentation](file:///c:/Users/sridharan/Downloads/Dev-4/docs/database.md)
- [API Reference](file:///c:/Users/sridharan/Downloads/Dev-4/docs/api.md)
- [Role Permissions Matrix](file:///c:/Users/sridharan/Downloads/Dev-4/docs/permissions.md)
- [Deployment Guide](file:///c:/Users/sridharan/Downloads/Dev-4/docs/deployment.md)

---
MIT License © 2026 SmartCampus Team
