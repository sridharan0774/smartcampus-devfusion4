import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('SmartCampus API Integration Tests', () => {
  let studentCookie: string;
  let adminCookie: string;
  let eventId: string;
  let placementId: string;

  beforeAll(async () => {
    // Perform seed/login setup
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@smartcampus.demo',
        password: 'Password123!',
      });

    expect(adminRes.status).toBe(200);
    adminCookie = adminRes.headers['set-cookie'][0];

    const studentRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@smartcampus.demo',
        password: 'Password123!',
      });

    expect(studentRes.status).toBe(200);
    studentCookie = studentRes.headers['set-cookie'][0];
  });

  it('Auth: Should return current user profile via HTTP-only cookie', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [studentCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('student@smartcampus.demo');
    expect(res.body.data.role).toBe('STUDENT');
  });

  it('RBAC: Student should be forbidden (403) from accessing admin routes', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Cookie', [studentCookie]);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  it('RBAC: Admin should successfully list users', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Cookie', [adminCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.users)).toBe(true);
  });

  it('Events: Student should list events', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Cookie', [studentCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    if (res.body.data.length > 0) {
      eventId = res.body.data[0].id;
    }
  });

  it('Events: Duplicate event registration should be prevented', async () => {
    if (!eventId) return;

    // First attempt (might already be registered from seed)
    const firstRes = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Cookie', [studentCookie]);

    // Second attempt MUST return 400 DUPLICATE_REGISTRATION if already registered
    const secondRes = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Cookie', [studentCookie]);

    expect(secondRes.status).toBe(400);
    expect(secondRes.body.code).toBe('DUPLICATE_REGISTRATION');
  });

  it('Placements: Student should list placement drives', async () => {
    const res = await request(app)
      .get('/api/placements')
      .set('Cookie', [studentCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    if (res.body.data.length > 0) {
      placementId = res.body.data[0].id;
    }
  });

  it('Placements: Duplicate placement application should be prevented', async () => {
    if (!placementId) return;

    const secondApp = await request(app)
      .post(`/api/placements/${placementId}/apply`)
      .set('Cookie', [studentCookie])
      .send({ resumeUrl: 'https://smartcampus.demo/resume.pdf' });

    expect(secondApp.status).toBe(400);
    expect(secondApp.body.code).toBe('DUPLICATE_APPLICATION');
  });

  it('Attendance: Student should fetch attendance percentage summary', async () => {
    const res = await request(app)
      .get('/api/attendance/summary')
      .set('Cookie', [studentCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.overallPercentage).toBe('number');
  });
});
