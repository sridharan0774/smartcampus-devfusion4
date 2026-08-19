# SmartCampus Architecture Documentation

## System Topology & Data Flow

```
+-------------------------------------------------------------------+
|                           CLIENT LAYER                            |
|  React 18 + Vite + TypeScript + Tailwind CSS + TanStack Query UI  |
+-------------------------------------------------------------------+
                                  |
               HTTPS / REST API & WSS (Socket.IO)
                                  v
+-------------------------------------------------------------------+
|                        APPLICATION SERVER                         |
|     Node.js + Express + TypeScript + Socket.IO Realtime Engine    |
|                                                                   |
|  Middlewares: Helmet | CORS | Rate Limiting | Cookie Session CSRF |
|               Auth Token Cookie & Server-side RBAC               |
+-------------------------------------------------------------------+
                                  |
                               Prisma
                                  v
+-------------------------------------------------------------------+
|                          DATABASE LAYER                           |
|                       PostgreSQL 16 Engine                        |
|                                                                   |
|   Users, Roles, Departments, Courses, Subjects, Attendance,       |
|   Assignments, Events, Placements, Clubs, Announcements, Logs     |
+-------------------------------------------------------------------+
```

## Key Components

1. **Frontend (`apps/web`)**:
   - Modern Single Page Application built with React 18, Vite, TypeScript, and Tailwind CSS.
   - TanStack React Query for cached backend API data fetching.
   - Socket.IO client for immediate push notifications.
   - Dark/Light mode dynamic visual styling.

2. **Backend (`apps/api`)**:
   - RESTful API built on Express and TypeScript.
   - HTTP-Only secure cookie sessions with JWT signature.
   - Express Rate-Limiter, Helmet headers, CORS policies, CSRF tokens.
   - Service layer executing parameterized PostgreSQL operations via Prisma ORM.

3. **Shared SDK (`packages/shared`)**:
   - Shared domain models, enums, DTOs, and Zod validation logic used across frontend and backend.
