# ✅ Pre-Deployment Checklist

## Before You Deploy

### 1. Code Ready
- [ ] All files saved
- [ ] No console errors locally
- [ ] Test all features work
- [ ] Run `npm install` successfully
- [ ] Run `npm run build` successfully

### 2. GitHub Ready
- [ ] GitHub account created
- [ ] Repository created
- [ ] Code pushed to GitHub
- [ ] Repository is public (or Railway has access)

### 3. Railway Account
- [ ] Railway account created
- [ ] Logged in with GitHub
- [ ] Payment method added (optional, free tier available)

---

## Deployment Steps

### Step 1: Update Code (Already Done!)
- [x] server/index.js serves frontend
- [x] package.json has "start" script
- [x] API uses relative paths
- [x] CORS set to * for same-domain

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy to Railway
1. Go to railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Wait for build (2-3 minutes)

### Step 4: Add Environment Variables
Copy-paste this in Railway Variables (Raw Editor):
```
NODE_ENV=production
PORT=3001
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING
JWT_EXPIRES_IN=7d
DB_PATH=./server/dawai-lo.db
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Configure Build
- Build Command: `npm install && npm run build`
- Start Command: `node server/index.js`

### Step 6: Generate Domain
- Go to Settings → Domains
- Click "Generate Domain"
- Get your URL!

---

## After Deployment

### Test Everything
- [ ] App loads at Railway URL
- [ ] Landing page shows
- [ ] Login works (doctor@test.com / doctor123)
- [ ] Doctor can add patients
- [ ] Doctor can create prescriptions
- [ ] Pharmacist can view prescriptions
- [ ] Patient can mark doses
- [ ] Data persists after refresh

### Monitor
- [ ] Check logs for errors
- [ ] Monitor CPU/Memory usage
- [ ] Test from different devices
- [ ] Test from different networks

---

## Troubleshooting

### Build Fails
1. Check package.json is valid
2. Run `npm install && npm run build` locally
3. Check Railway logs for specific error

### App Not Loading
1. Check Railway logs
2. Verify PORT=3001
3. Check start command is correct

### Login Not Working
1. Check JWT_SECRET is set
2. Check database is created
3. Check logs for errors

### Database Not Persisting
1. Add Railway volume: `/app/server`
2. This persists the database file

---

## Quick Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Build Locally
```bash
npm run build
npm start
# Visit http://localhost:3001
```

### Push to GitHub
```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## Support

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **DawaiLo Guide:** BEGINNER_DEPLOYMENT.md

---

## Success!

When everything works:
- ✅ App is live
- ✅ Accessible worldwide
- ✅ HTTPS enabled
- ✅ Auto-deploys on push
- ✅ Logs available
- ✅ Monitoring active

**Share your URL and celebrate!** 🎉
