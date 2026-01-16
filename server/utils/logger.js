import { config } from '../config.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const colors = {
  error: '\x1b[31m', // Red
  warn: '\x1b[33m',  // Yellow
  info: '\x1b[36m',  // Cyan
  debug: '\x1b[90m', // Gray
  reset: '\x1b[0m'
};

class Logger {
  constructor() {
    this.level = levels[config.logging.level] || levels.info;
  }

  log(level, message, meta = {}) {
    if (levels[level] > this.level) return;

    const timestamp = new Date().toISOString();
    const color = colors[level];
    const reset = colors.reset;
    
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    
    console.log(`${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message} ${metaStr}`);
  }

  error(message, meta) {
    this.log('error', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  debug(message, meta) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();
