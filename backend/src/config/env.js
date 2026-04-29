import dotenv from 'dotenv';
dotenv.config();

function parseCorsOrigins(value) {
  if (!value) return ['http://localhost:5173'];
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS || process.env.FRONTEND_URL),
};
