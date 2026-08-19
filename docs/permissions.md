# Role-Based Access Control (RBAC) Matrix

SmartCampus strictly enforces server-side Role-Based Access Control on every protected API route. Frontend state is never trusted for authorization decisions.

## Role Permission Matrix

| Feature / Resource | STUDENT | FACULTY | COORDINATOR | ADMIN |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard** | Yes (Student) | Yes (Faculty) | Yes (Coord) | Yes (Admin) |
| **View Own Classes & Schedule** | Yes | Yes | Yes | Yes |
| **View Own Attendance History** | Yes | No | No | Yes |
| **Create Attendance Session** | No | Yes | No | Yes |
| **Mark Attendance Records** | No | Yes | No | Yes |
| **Submit Assignment** | Yes | No | No | Yes |
| **Create Assignment / Rubric** | No | Yes | No | Yes |
| **Grade Submissions & Feedback** | No | Yes | No | Yes |
| **Browse & Register Events** | Yes | Yes | Yes | Yes |
| **Create / Edit / Cancel Events** | No | No | Yes | Yes |
| **Generate QR Passes** | No | No | Yes | Yes |
| **Apply for Placements** | Yes | No | No | Yes |
| **Create / Manage Placements** | No | No | Yes | Yes |
| **Manage Clubs & Approve Requests** | Join Request | View | Manage Own | Full Access |
| **Publish Announcements** | No | Yes | Yes | Yes |
| **Global User Management** | No | No | No | Yes |
| **Assign Roles & Delete Users** | No | No | No | Yes |
| **View System & Audit Logs** | No | No | No | Yes |
| **Export Reports (CSV/Excel)** | No | No | Yes | Yes |

Every request checks the HTTP-Only cookie JWT payload against the required role array via `requireRole(['ADMIN', 'FACULTY'])` middleware. Unauthorized attempts immediately return HTTP 403 Forbidden.
