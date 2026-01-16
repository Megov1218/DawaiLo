import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3001,
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  database: {
    path: process.env.DB_PATH || './server/dawai-lo.db'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

// Validate critical config
if (config.nodeEnv === 'production' && config.jwt.secret === 'fallback-secret-key-change-this') {
  console.error('⚠️  WARNING: Using default JWT secret in production! Set JWT_SECRET environment variable.');
}
