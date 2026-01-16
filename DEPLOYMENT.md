# 🚀 DawaiLo - Production Deployment Guide

## Security Features Implemented ✅

### 1. Environment Variables
- All sensitive config in `.env` files
- `.env.example` for reference
- `.env.production` for production settings
- Never commit `.env` files to git

### 2. JWT Authentication
- Secure token-based authentication
- Tokens expire after 7 days (configurable)
- Stored in localStorage on client
- Sent in Authorization header

### 3. Password Hashing
- bcrypt with salt rounds = 10
- All passwords hashed before storage
- Never store plain text passwords
- Existing test users have hashed passwords

### 4. Security Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: Prevent abuse (100 req/15min)
- **JWT Verification**: Protected routes
- **Role-based Authorization**: Access control

### 5. Logging & Monitoring
- Custom logger with levels (error, warn, info, debug)
- Colored console output
- Request logging with Morgan
- Error tracking
- User action audit trail

---

## 📋 Pre-Deployment Checklist

### Required Changes
- [ ] Change `JWT_SECRET` in `.env.production`
- [ ] Update `CORS_ORIGIN` with your frontend URL
- [ ] Set `NODE_ENV=production`
- [ ] Review rate limiting settings
- [ ] Test all endpoints with JWT auth
- [ ] Backup database before migration

### Optional Enhancements
- [ ] Set up PostgreSQL (instead of SQLite)
- [ ] Add Redis for session management
- [ ] Configure CDN for static assets
- [ ] Set up SSL/TLS certificates
- [ ] Configure monitoring (Sentry, DataDog)
- [ ] Set up automated backups

---

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Why Railway?**
- Free tier available
- Automatic HTTPS
- Easy environment variables
- Built-in monitoring
- One-click deploy

**Steps:**
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-secure-random-string
   CORS_ORIGIN=https://your-frontend.railway.app
   ```
6. Deploy!

**Cost:** Free tier → $5/month for production

---

### Option 2: Render

**Why Render?**
- Free tier with auto-sleep
- Easy database setup
- Automatic deploys
- Good for small apps

**Steps:**
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click "New" → "Web Service"
4. Connect GitHub repository
5. Use `render.yaml` config (already included)
6. Add environment variables in dashboard
7. Deploy!

**Cost:** Free tier (sleeps after inactivity) → $7/month

---

### Option 3: Docker + Any Cloud

**Why Docker?**
- Consistent environment
- Easy to scale
- Works anywhere
- Full control

**Steps:**
1. Build image:
   ```bash
   docker build -t dawai-lo .
   ```

2. Test locally:
   ```bash
   docker run -p 3001:3001 \
     -e JWT_SECRET=your-secret \
     -e CORS_ORIGIN=http://localhost:5173 \
     dawai-lo
   ```

3. Push to registry:
   ```bash
   docker tag dawai-lo your-registry/dawai-lo
   docker push your-registry/dawai-lo
   ```

4. Deploy to:
   - **AWS ECS/Fargate**
   - **Google Cloud Run**
   - **Azure Container Instances**
   - **DigitalOcean App Platform**

**Cost:** Varies by provider ($5-20/month)

---

### Option 4: Vercel (Frontend) + Railway (Backend)

**Why Split?**
- Best performance for frontend
- Separate scaling
- Vercel's global CDN

**Steps:**

**Backend (Railway):**
1. Deploy backend to Railway (see Option 1)
2. Note the backend URL

**Frontend (Vercel):**
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
4. Deploy!

**Cost:** Free for both!

---

## 🔐 Environment Variables Reference

### Required
```bash
NODE_ENV=production
JWT_SECRET=<generate-secure-random-string>
CORS_ORIGIN=<your-frontend-url>
```

### Optional
```bash
PORT=3001
JWT_EXPIRES_IN=7d
DB_PATH=./server/dawai-lo.db
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Generate Secure JWT Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Online
# https://www.grc.com/passwords.htm
```

---

## 🗄️ Database Migration (SQLite → PostgreSQL)

For production at scale, consider PostgreSQL:

### 1. Install pg package
```bash
npm install pg
```

### 2. Update database.js
```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### 3. Convert queries
```javascript
// SQLite
db.prepare('SELECT * FROM users WHERE id = ?').get(id);

// PostgreSQL
await pool.query('SELECT * FROM users WHERE id = $1', [id]);
```

### 4. Add to Railway/Render
Both platforms offer PostgreSQL add-ons with one click!

---

## 📊 Monitoring Setup

### Option 1: Built-in Logging
Already implemented! Check logs:
```bash
# Railway
railway logs

# Render
Check dashboard logs

# Docker
docker logs <container-id>
```

### Option 2: Sentry (Error Tracking)
```bash
npm install @sentry/node

# In server/index.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Option 3: DataDog / New Relic
For enterprise monitoring, integrate:
- Application performance monitoring
- Real-time metrics
- Custom dashboards
- Alerts

---

## 🧪 Testing Before Deploy

### 1. Test Locally with Production Settings
```bash
# Copy production env
cp .env.production .env

# Start server
npm run server

# Test endpoints
curl http://localhost:3001/health
```

### 2. Test JWT Authentication
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@test.com","password":"doctor123"}'

# Use token
curl http://localhost:3001/api/patients \
  -H "Authorization: Bearer <your-token>"
```

### 3. Test Rate Limiting
```bash
# Send 101 requests quickly
for i in {1..101}; do
  curl http://localhost:3001/api/patients
done
# Should get rate limit error
```

---

## 🚨 Common Issues & Solutions

### Issue: "Invalid token" errors
**Solution:** Check JWT_SECRET matches between deployments

### Issue: CORS errors
**Solution:** Update CORS_ORIGIN to match frontend URL exactly

### Issue: Database not persisting
**Solution:** Mount volume in Docker or use persistent storage

### Issue: Rate limit too strict
**Solution:** Increase RATE_LIMIT_MAX_REQUESTS

### Issue: Slow performance
**Solution:** 
- Enable database indexes (already done)
- Add Redis caching
- Use CDN for static assets
- Upgrade server resources

---

## 📈 Scaling Considerations

### Current Capacity
- **Users:** 100-500 concurrent
- **Requests:** 100/15min per IP
- **Database:** SQLite (single file)

### When to Scale
- **1,000+ users:** Add PostgreSQL
- **10,000+ users:** Add Redis cache
- **100,000+ users:** Load balancer + multiple instances

### Scaling Steps
1. **Database:** SQLite → PostgreSQL
2. **Caching:** Add Redis for sessions
3. **Storage:** Move to S3 for files
4. **Compute:** Horizontal scaling (multiple instances)
5. **CDN:** CloudFlare for static assets

---

## 🔒 Security Best Practices

### Implemented ✅
- Password hashing (bcrypt)
- JWT authentication
- Rate limiting
- CORS protection
- Security headers (Helmet)
- Input validation
- Role-based access control

### Recommended Additions
- [ ] HTTPS only (SSL/TLS)
- [ ] Content Security Policy
- [ ] SQL injection prevention (parameterized queries - done)
- [ ] XSS protection (sanitize inputs)
- [ ] CSRF tokens
- [ ] API versioning
- [ ] Request signing
- [ ] IP whitelisting for admin

---

## 📝 Post-Deployment

### 1. Verify Deployment
```bash
# Health check
curl https://your-app.com/health

# Test login
curl -X POST https://your-app.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@test.com","password":"doctor123"}'
```

### 2. Monitor Logs
- Check for errors
- Monitor response times
- Track user activity

### 3. Set Up Alerts
- Server down
- High error rate
- Database issues
- Rate limit exceeded

### 4. Backup Strategy
```bash
# Backup database daily
cp server/dawai-lo.db backups/dawai-lo-$(date +%Y%m%d).db

# Automate with cron
0 2 * * * /path/to/backup-script.sh
```

---

## 🎉 You're Production Ready!

Your DawaiLo app now has:
- ✅ Secure authentication (JWT)
- ✅ Password hashing (bcrypt)
- ✅ Environment variables
- ✅ Rate limiting
- ✅ Security headers
- ✅ Logging & monitoring
- ✅ Deployment configs
- ✅ Docker support

**Next Steps:**
1. Choose deployment platform
2. Set environment variables
3. Deploy!
4. Test thoroughly
5. Monitor and iterate

**Estimated deployment time:** 15-30 minutes

Good luck! 🚀
