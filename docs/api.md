# REST API Reference Documentation

All API responses strictly adhere to the standardized payload structure:

### Success Response (HTTP 200/201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response (HTTP 400/401/403/404/500)
```json
{
  "success": false,
  "message": "Error details",
  "code": "ERROR_CODE"
}
```

## Primary Endpoints Overview

| Endpoint Category | Base Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth` | Login, Register, Logout, Verify Email, Forgot/Reset Password, Google OAuth | Public / Auth |
| **Students** | `/api/students` | Profile, Class schedule, History | Student / Faculty / Admin |
| **Faculty** | `/api/faculty` | Classes, Submission reviews, Performance analytics | Faculty / Admin |
| **Attendance** | `/api/attendance` | Sessions creation, QR generation, Mark present/absent, Stats | Faculty / Student / Admin |
| **Assignments** | `/api/assignments` | Create assignments, Rubrics, Upload PDF/ZIP submissions, Grade | All Roles |
| **Events** | `/api/events` | Create events, Register ticket, Download QR pass | All Roles |
| **Placements** | `/api/placements` | Job listings, Eligibility criteria, Submit resume, Status tracking | All Roles |
| **Clubs** | `/api/clubs` | Listing, Membership join requests, Approvals | All Roles |
| **Announcements** | `/api/announcements` | Target announcements publishing and broadcast | All Roles |
| **Notifications** | `/api/notifications` | Unread notifications, Mark read, Preferences | Auth Users |
| **Search** | `/api/search` | Global debounced categorized search | Auth Users |
| **Analytics** | `/api/analytics` | Department & campus-wide metrics | Admin / Faculty |
| **Reports** | `/api/reports` | Export CSV/Excel spreadsheets | Admin / Coordinator |
| **Admin** | `/api/admin` | User CRUD, Role assignment, System settings, Audit logs | Admin Only |

Interactive OpenAPI / Swagger specification is served at `/api/docs`.
