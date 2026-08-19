import swaggerJsdoc from 'swagger-jsdoc';
import { ENV } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartCampus Platform REST API Documentation',
      version: '1.0.0',
      description: 'DevFusion 4.O Smart Campus Management Platform API Specification',
      contact: {
        name: 'SmartCampus Dev Team',
        email: 'admin@smartcampus.edu',
      },
    },
    servers: [
      {
        url: ENV.BACKEND_URL,
        description: 'Primary API Server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'smartcampus_token',
          description: 'HTTP-only secure JWT session cookie',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
