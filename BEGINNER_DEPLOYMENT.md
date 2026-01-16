# 🚀 DawaiLo - Beginner's Deployment Guide

## The Problem You Mentioned

You're right! We have:
- Frontend (React) and Backend (Node.js) in **one project**
- CORS needs frontend URL, but we don't have it yet
- Never deployed before

## The Solution: Railway (All-in-One Deployment)

Railway will:
- ✅ Build your frontend
- ✅ Run your backend
- ✅ Serve both from **same domain** (no CORS issues!)
- ✅ Give you one URL for everything
- ✅ Free to start

---

## 📋 Prerequisites

1. **GitHub Account** (free) - [github.com](https://github.com)
2. **Railway Account** (free) - [railway.app](https://railway.app)
3. **Your code pushed to GitHub**

---

## Step 1: Prepare Your Code (5 minutes)

### 1.1 Update server/index.js to serve frontend

We need to make the backend serve the built frontend files:

```javascript
// Add this AFTER all your API routes, BEFORE app.listen()

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React build
if (config.nodeEnv === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  // All non-API routes serve React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}
```

### 1.2 Update package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "node server/index.js",
    "server:dev": "nodemon server/index.js",
    "dev:all": "concurrently \"npm run dev\" \"npm run server:dev\"",
    "start": "npm run build && node server/index.js"
  }
}
```

### 1.3 Update .env.production

Since everything is on same domain, no CORS needed!

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING
JWT_EXPIRES_IN=7d
DB_PATH=./server/dawai-lo.db
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### 1.4 Update src/utils/api.js

```javascript
// Change this line:
const API_BASE = import.meta.env.VITE_API_URL || '/api';
// Now it uses relative path - works on same domain!
```

---

## Step 2: Push to GitHub (5 minutes)

### 2.1 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `dawai-lo`
4. Make it **Public** (easier for Railway)
5. Click "Create repository"

### 2.2 Push Your Code

Open terminal in your project folder:

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - DawaiLo production ready"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/dawai-lo.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Done!** Your code is now on GitHub.

---

## Step 3: Deploy to Railway (10 minutes)

### 3.1 Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Login"
3. Choose "Login with GitHub"
4. Authorize Railway

### 3.2 Create New Project

1. Click "New Project"
2. Choose "Deploy from GitHub repo"
3. Select your `dawai-lo` repository
4. Click "Deploy Now"

Railway will start building automatically!

### 3.3 Add Environment Variables

1. Click on your deployment
2. Go to "Variables" tab
3. Click "Raw Editor"
4. Paste this:

```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-random-string-change-this
JWT_EXPIRES_IN=7d
DB_PATH=./server/dawai-lo.db
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

5. Click "Update Variables"

**Important:** Change `JWT_SECRET` to a random string!

Generate one:
```bash
# In terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 Configure Build Settings

1. Go to "Settings" tab
2. Find "Build Command"
3. Set to: `npm install && npm run build`
4. Find "Start Command"
5. Set to: `node server/index.js`
6. Click "Save"

### 3.5 Redeploy

1. Go to "Deployments" tab
2. Click "Deploy" button
3. Wait 2-3 minutes

---

## Step 4: Get Your URL (1 minute)

1. Go to "Settings" tab
2. Find "Domains" section
3. Click "Generate Domain"
4. You'll get a URL like: `https://dawai-lo-production.up.railway.app`

**That's your app URL!** 🎉

---

## Step 5: Test Your Deployment (2 minutes)

### 5.1 Open Your App

Visit your Railway URL: `https://your-app.up.railway.app`

You should see the DawaiLo landing page!

### 5.2 Test Login

1. Click "Get Started" or "Login"
2. Use test credentials:
   - Email: `doctor@test.com`
   - Password: `doctor123`
3. You should be logged in!

### 5.3 Test All Features

- ✅ Doctor can add patients
- ✅ Doctor can create prescriptions
- ✅ Pharmacist can view prescriptions
- ✅ Patient can mark doses

---

## 🎉 You're Live!

Your app is now:
- ✅ Deployed to production
- ✅ Accessible worldwide
- ✅ HTTPS enabled (secure)
- ✅ No CORS issues (same domain)
- ✅ Database persisted
- ✅ Logs available

---

## 📊 Railway Dashboard

### View Logs
1. Go to your project
2. Click "Deployments"
3. Click on latest deployment
4. See real-time logs

### Monitor Usage
1. Go to "Metrics" tab
2. See CPU, Memory, Network usage

### Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Click "Custom Domain"
3. Add your domain (e.g., dawai-lo.com)
4. Follow DNS instructions

---

## 🔧 Common Issues & Fixes

### Issue 1: Build Failed
**Error:** "npm install failed"

**Fix:**
1. Check package.json is valid JSON
2. Make sure all dependencies are listed
3. Try locally: `npm install && npm run build`

### Issue 2: App Not Loading
**Error:** "Application failed to respond"

**Fix:**
1. Check "Logs" tab for errors
2. Verify PORT is set to 3001
3. Check start command: `node server/index.js`

### Issue 3: Database Not Persisting
**Error:** "Data disappears after redeploy"

**Fix:**
1. Go to "Settings" → "Volumes"
2. Add volume: `/app/server`
3. This persists the database file

### Issue 4: Login Not Working
**Error:** "Invalid credentials"

**Fix:**
1. Check JWT_SECRET is set
2. Check logs for errors
3. Database might need reseeding

---

## 💰 Pricing

### Free Tier
- ✅ $5 free credit per month
- ✅ Enough for development/testing
- ✅ Sleeps after inactivity (wakes on request)

### Hobby Plan ($5/month)
- ✅ No sleeping
- ✅ Always available
- ✅ Better performance
- ✅ More resources

### Pro Plan ($20/month)
- ✅ Production-ready
- ✅ High availability
- ✅ Priority support
- ✅ More resources

**Start with free tier, upgrade when needed!**

---

## 🔄 Updating Your App

### Make Changes Locally
```bash
# Make your changes
# Test locally: npm run dev:all

# Commit changes
git add .
git commit -m "Updated feature X"

# Push to GitHub
git push
```

### Railway Auto-Deploys!
- Railway watches your GitHub repo
- Automatically deploys on push
- Takes 2-3 minutes
- Check "Deployments" tab

---

## 🎓 What You Learned

1. ✅ How to deploy full-stack app
2. ✅ How to use Railway
3. ✅ How to configure environment variables
4. ✅ How to monitor logs
5. ✅ How to update deployed app
6. ✅ How to handle CORS (by avoiding it!)

---

## 🆘 Need Help?

### Railway Support
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

### DawaiLo Issues
- Check logs in Railway dashboard
- Review DEPLOYMENT.md for details
- Check PRODUCTION_READY.md for checklist

---

## 🎉 Success Checklist

After deployment, verify:
- [ ] App loads at Railway URL
- [ ] Login works
- [ ] Doctor can add patients
- [ ] Doctor can create prescriptions
- [ ] Pharmacist can view prescriptions
- [ ] Patient can mark doses
- [ ] Data persists after refresh
- [ ] Logs show no errors

---

## 🚀 Next Steps

### 1. Custom Domain (Optional)
Buy a domain (e.g., dawai-lo.com) and connect it to Railway

### 2. Add More Users
Create more test accounts for demo

### 3. Monitor Usage
Check Railway metrics regularly

### 4. Backup Database
Download database file from Railway volumes

### 5. Share Your App!
Send the URL to users/investors

---

## 📝 Quick Reference

**Your Railway URL:** `https://your-app.up.railway.app`

**Test Credentials:**
- Doctor: doctor@test.com / doctor123
- Pharmacist: pharmacist@test.com / pharma123
- Patient: patient@test.com / patient123

**Railway Dashboard:** [railway.app/dashboard](https://railway.app/dashboard)

**GitHub Repo:** `https://github.com/YOUR_USERNAME/dawai-lo`

---

## 🎊 Congratulations!

You've successfully deployed your first full-stack application!

**What you achieved:**
- ✅ Deployed to production
- ✅ Secured with HTTPS
- ✅ Accessible worldwide
- ✅ Auto-deploys on updates
- ✅ Monitored and logged

**You're now a deployment pro!** 🚀

---

*Need help? Check the logs first, then review this guide.*
