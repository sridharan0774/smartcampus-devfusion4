# Deployment Guide

SmartCampus is Docker-ready and can be deployed to modern cloud providers (Vercel/Render/Railway/AWS/GCP).

## Local Development Deployment (Docker Compose)

1. Clone the repository and configure environment:
   ```bash
   cp .env.example .env
   ```

2. Spin up PostgreSQL 16 database, Express API, and Vite web app:
   ```bash
   docker-compose up -d --build
   ```

3. Run Prisma database migrations and seed data:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Access services:
   - Frontend Web App: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - Interactive Swagger Docs: `http://localhost:5000/api/docs`

## Production Deployment Checklist
- Set `NODE_ENV=production`.
- Ensure `JWT_SECRET` and `COOKIE_SECRET` are set to cryptographically secure strings.
- Set `DATABASE_URL` to managed PostgreSQL instance.
- Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for Google OAuth.
- Configure `SMTP_*` for email verification and password reset notifications.
