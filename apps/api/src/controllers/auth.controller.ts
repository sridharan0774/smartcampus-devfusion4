import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { AuthenticatedRequest } from '../middlewares/auth';
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from '@smartcampus/shared';
import { ENV } from '../config/env';

export const register = async (req: Request, res: Response) => {
  const data = RegisterSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address already exists.',
      code: 'EMAIL_EXISTS',
    });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      departmentId: data.departmentId || null,
      rollNumber: data.rollNumber || null,
      semester: data.semester || null,
      isVerified: false,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  // Generate Email Verification Token
  const tokenStr = crypto.randomBytes(32).toString('hex');
  await prisma.emailVerificationToken.create({
    data: {
      email: user.email,
      token: tokenStr,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  await sendVerificationEmail(user.email, tokenStr);

  return res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email address to log in.',
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = LoginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { department: true },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
      code: 'INVALID_CREDENTIALS',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
      code: 'INVALID_CREDENTIALS',
    });
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Save session record
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  setAuthCookie(res, token);

  return res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        departmentId: user.departmentId,
        departmentName: user.department?.name,
        rollNumber: user.rollNumber,
        semester: user.semester,
        skills: user.skills,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        resumeUrl: user.resumeUrl,
        bio: user.bio,
      },
    },
  });
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    await prisma.session.deleteMany({
      where: { userId: req.user.userId },
    });
  }

  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthenticated',
      code: 'UNAUTHORIZED',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: { department: true },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User profile not found.',
      code: 'NOT_FOUND',
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      departmentId: user.departmentId,
      departmentName: user.department?.name,
      phone: user.phone,
      rollNumber: user.rollNumber,
      semester: user.semester,
      skills: user.skills,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
      resumeUrl: user.resumeUrl,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Verification token is required.',
      code: 'MISSING_TOKEN',
    });
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired email verification token.',
      code: 'INVALID_TOKEN',
    });
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { isVerified: true },
  });

  await prisma.emailVerificationToken.delete({
    where: { id: record.id },
  });

  return res.status(200).json({
    success: true,
    message: 'Email address verified successfully! You may now access all features.',
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = ForgotPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail(email, resetToken);
  }

  // Always return success to prevent email enumeration
  return res.status(200).json({
    success: true,
    message: 'If an account exists with that email address, a password reset link has been dispatched.',
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = ResetPasswordSchema.parse(req.body);

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired password reset token.',
      code: 'INVALID_TOKEN',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: record.email },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({
    where: { id: record.id },
  });

  return res.status(200).json({
    success: true,
    message: 'Password reset successful. You may now log in with your new password.',
  });
};

export const getGoogleOAuthUrl = async (_req: Request, res: Response) => {
  if (!ENV.GOOGLE_CLIENT_ID || !ENV.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({
      success: false,
      message: 'Google OAuth is not configured on this server environment.',
      code: 'OAUTH_NOT_CONFIGURED',
      data: { configured: false },
    });
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: ENV.GOOGLE_CALLBACK_URL,
    client_id: ENV.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);

  return res.status(200).json({
    success: true,
    data: {
      configured: true,
      url: `${rootUrl}?${qs.toString()}`,
    },
  });
};
