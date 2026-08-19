import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { ENV } from './config/env';
import { swaggerSpec } from './config/swagger';
import { initSocket } from './config/socket';
import { errorHandler } from './middlewares/error';

// Import Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import attendanceRoutes from './routes/attendance.routes';
import assignmentRoutes from './routes/assignment.routes';
import eventRoutes from './routes/event.routes';
import placementRoutes from './routes/placement.routes';
import clubRoutes from './routes/club.routes';
import announcementRoutes from './routes/announcement.routes';
import notificationRoutes from './routes/notification.routes';
import searchRoutes from './routes/search.routes';
import analyticsRoutes from './routes/analytics.routes';
import reportRoutes from './routes/report.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // allow inline scripts in dev/swagger
}));

app.use(cors({
  origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});
app.use('/api', limiter);

// Body Parsing & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(ENV.COOKIE_SECRET));

// Static files for uploads
app.use('/uploads', express.static(path.resolve(process.cwd(), ENV.UPLOAD_DIR)));

// Swagger API Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartCampus API Engine Operational',
    timestamp: new Date().toISOString(),
  });
});

// Centralized Error Middleware
app.use(errorHandler);

const PORT = ENV.PORT;
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SmartCampus REST API Server running on port ${PORT}`);
  console.log(`📄 Swagger OpenAPI Docs: http://localhost:${PORT}/api/docs`);
  console.log(`⚡ Socket.IO Realtime Server Active`);
  console.log(`======================================================\n`);
});

export default app;
