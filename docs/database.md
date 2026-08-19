# Database Documentation - PostgreSQL & Prisma Schema

SmartCampus uses PostgreSQL 16 as its database engine, managed strictly via Prisma ORM (`provider = "postgresql"`).

## Entities (24 Core Tables)

1. `users`: Core user account table storing email, password hash, role enum, profile metadata.
2. `roles`: Role definitions (`STUDENT`, `FACULTY`, `COORDINATOR`, `ADMIN`).
3. `departments`: College departments (e.g. CS, ECE, ME).
4. `courses`: Degree programs under departments (e.g. B.Tech Computer Science).
5. `subjects`: Academic course subjects assigned to faculty and courses.
6. `attendance_sessions`: Faculty-created attendance sessions with date, subject, and optional QR token.
7. `attendances`: Individual student attendance records (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`) with unique `[sessionId, studentId]` constraint.
8. `assignments`: Course assignments with deadline, rubric, max marks, attachments.
9. `assignment_attachments`: File attachments associated with assignments.
10. `assignment_submissions`: Student submission records with uploaded PDF/ZIP file, GitHub link, status, marks, feedback. Unique `[assignmentId, studentId]` constraint.
11. `events`: Campus events managed by coordinators/admins with venue, seat limit, start/end date, banner.
12. `event_speakers`: Keynote speakers attached to campus events.
13. `event_registrations`: Student event ticket registrations with unique QR pass code. Unique `[eventId, studentId]` constraint.
14. `placements`: Placement drives with company name, job role, CTC, eligibility requirements.
15. `applications`: Student job application tracking (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`). Unique `[placementId, studentId]` constraint.
16. `clubs`: Student clubs with category, description, and coordinator owner.
17. `club_memberships`: Club membership join requests and approvals. Unique `[clubId, studentId]` constraint.
18. `announcements`: Targeted announcements filtered by department, role, priority, and date range.
19. `notifications`: In-app realtime notifications with read/unread flags.
20. `activity_logs`: Immutable audit logging for sensitive admin actions.
21. `settings`: Global platform settings key-value repository.
22. `sessions`: HTTP-only user login session tokens and expiry.
23. `email_verification_tokens`: Tokens for account email verification.
24. `password_reset_tokens`: One-time security tokens for password reset workflow.
