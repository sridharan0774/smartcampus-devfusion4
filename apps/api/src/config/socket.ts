import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ENV } from './env';

let io: Server | null = null;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: ENV.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`⚡ [Socket.IO] Client connected: ${socket.id}`);

    socket.on('join_user_room', (userId: string) => {
      socket.join(`user_${userId}`);
      console.log(`👤 Socket ${socket.id} joined room user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`⚡ [Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

export const sendRealtimeNotification = (userId: string, notification: any) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};
