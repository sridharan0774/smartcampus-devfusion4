import { Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { CreateEventSchema } from '@smartcampus/shared';
import { generateQRCodeDataURL } from '../utils/qr';

export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
  const data = CreateEventSchema.parse(req.body);
  const organizerId = req.user!.userId;

  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      bannerUrl: data.bannerUrl || null,
      venue: data.venue,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      registrationDeadline: new Date(data.registrationDeadline),
      maxSeats: data.maxSeats,
      availableSeats: data.maxSeats,
      organizerId,
      speakers: data.speakers ? {
        create: data.speakers.map((s: any) => ({
          name: s.name,
          title: s.title,
          bio: s.bio || null,
          photoUrl: s.photoUrl || null,
        })),
      } : undefined,
    },
    include: {
      speakers: true,
      organizer: { select: { id: true, name: true, email: true } },
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Campus event created successfully.',
    data: event,
  });
};

export const listEvents = async (req: AuthenticatedRequest, res: Response) => {
  const events = await prisma.event.findMany({
    include: {
      speakers: true,
      organizer: { select: { id: true, name: true } },
      _count: { select: { registrations: true } },
    },
    orderBy: { startDate: 'asc' },
  });

  if (req.user?.role === 'STUDENT') {
    const studentRegistrations = await prisma.eventRegistration.findMany({
      where: { studentId: req.user.userId },
    });

    const regMap = new Map(studentRegistrations.map(r => [r.eventId, r]));

    const enriched = events.map(e => {
      const reg = regMap.get(e.id);
      return {
        ...e,
        isRegistered: !!reg,
        qrPassCode: reg ? reg.qrCodePass : null,
      };
    });

    return res.status(200).json({ success: true, data: enriched });
  }

  return res.status(200).json({ success: true, data: events });
};

export const registerForEvent = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;
  const studentId = req.user!.userId;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
      code: 'NOT_FOUND',
    });
  }

  if (event.availableSeats <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Registration closed. This event has reached maximum capacity.',
      code: 'EVENT_FULL',
    });
  }

  if (new Date() > event.registrationDeadline) {
    return res.status(400).json({
      success: false,
      message: 'Registration deadline has passed.',
      code: 'DEADLINE_PASSED',
    });
  }

  const existingRegistration = await prisma.eventRegistration.findUnique({
    where: {
      eventId_studentId: { eventId, studentId },
    },
  });

  if (existingRegistration) {
    return res.status(400).json({
      success: false,
      message: 'You have already registered for this event.',
      code: 'DUPLICATE_REGISTRATION',
    });
  }

  const qrPassCode = `TICKET-${event.title.substring(0, 5).toUpperCase()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

  const [registration] = await prisma.$transaction([
    prisma.eventRegistration.create({
      data: {
        eventId,
        studentId,
        qrCodePass: qrPassCode,
      },
    }),
    prisma.event.update({
      where: { id: eventId },
      data: { availableSeats: { decrement: 1 } },
    }),
  ]);

  const qrCodeDataUrl = await generateQRCodeDataURL(qrPassCode);

  return res.status(201).json({
    success: true,
    message: 'Event registration successful! Your digital QR Pass has been issued.',
    data: {
      ...registration,
      qrCodeDataUrl,
    },
  });
};

export const cancelRegistration = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;
  const studentId = req.user!.userId;

  const registration = await prisma.eventRegistration.findUnique({
    where: {
      eventId_studentId: { eventId, studentId },
    },
  });

  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'No active registration found for this event.',
      code: 'NOT_FOUND',
    });
  }

  await prisma.$transaction([
    prisma.eventRegistration.delete({
      where: { id: registration.id },
    }),
    prisma.event.update({
      where: { id: eventId },
      data: { availableSeats: { increment: 1 } },
    }),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Event registration cancelled successfully.',
  });
};

export const getEventTicket = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.params;
  const studentId = req.user!.userId;

  const registration = await prisma.eventRegistration.findUnique({
    where: {
      eventId_studentId: { eventId, studentId },
    },
    include: {
      event: true,
      student: { select: { id: true, name: true, email: true, rollNumber: true } },
    },
  });

  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'Event registration ticket not found.',
      code: 'NOT_FOUND',
    });
  }

  const qrCodeDataUrl = await generateQRCodeDataURL(registration.qrCodePass);

  return res.status(200).json({
    success: true,
    data: {
      ...registration,
      qrCodeDataUrl,
    },
  });
};
