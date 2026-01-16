# 🚀 Deploy DawaiLo to Render

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Deploy to Render

1. Go to **https://render.com**
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Click **"New"** → **"Web Service"**
4. Select your **`dawai-lo`** repository
5. Fill in:
   - **Name:** `dawai-lo`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server/index.js`

## Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

```
NODE_ENV=production
JWT_SECRET=<paste-your-generated-secret>
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

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes
3. Get your URL: `https://dawai-lo.onrender.com`

## Step 5: Test

Visit your URL and login:
- **Doctor:** doctor@test.com / doctor123
- **Pharmacist:** pharmacist@test.com / pharma123
- **Patient:** patient@test.com / patient123

---

## 🎉 Done!

Your app is live with:
- ✅ Persistent database
- ✅ HTTPS enabled
- ✅ Auto-deploys on push
- ✅ Free tier available

---

## 💰 Pricing

- **Free:** $0/month (sleeps after 15 min inactivity)
- **Paid:** $7/month (always on, better performance)

Start with free, upgrade when needed!

---

## 🔄 Update Your App

Make changes locally, then:

```bash
git add .
git commit -m "Updated feature"
git push
```

Render auto-deploys in 3-5 minutes!

---

**Need help?** Check README.md for more details.
