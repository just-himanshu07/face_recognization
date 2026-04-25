# Quick Start: Deploy to Netlify & Render

## 🚀 30-Minute Deployment Guide

### Step 1: Backend Deployment (Render) - 10 minutes

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub
   - Authorize Render to access your repositories

2. **Deploy Backend**
   - Click **"New +"** → **"Web Service"**
   - Select your GitHub repository (`Face`)
   - Fill in:
     - **Name**: `face-recognition-backend`
     - **Environment**: `Docker`
     - **Branch**: `main`
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for deployment

3. **Get Backend URL**
   - Once deployed, you'll see: `https://face-recognition-backend.onrender.com`
   - Copy this URL (you'll need it for the frontend)

4. **Verify Backend**
   - Visit: `https://face-recognition-backend.onrender.com/docs`
   - You should see the FastAPI Swagger UI ✅

---

### Step 2: Update Frontend Environment

Before deploying frontend, set the API URL:

```bash
cd /home/himanshuraj/Downloads/HackRust/Face

# Edit frontend/.env.production
# Change VITE_API_URL to your backend URL
echo "VITE_API_URL=https://face-recognition-backend.onrender.com" > frontend/.env.production

# Commit and push
git add frontend/.env.production
git commit -m "Update API URL for production"
git push origin main
```

---

### Step 3: Frontend Deployment (Netlify) - 5 minutes

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub
   - Authorize Netlify to access your repositories

2. **Deploy Frontend**
   - Click **"Add new site"** → **"Import an existing project"**
   - Select **GitHub**
   - Choose your `Face` repository
   - Configure:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`
   - Click **"Deploy site"**
   - Wait 2-5 minutes

3. **Get Frontend URL**
   - Once deployed, you'll get: `https://your-site.netlify.app`
   - This is your live application!

4. **Verify Frontend**
   - Visit your Netlify URL
   - Test that the app loads ✅

---

### Step 4: Final Configuration - 2 minutes

Update Render to allow requests from Netlify:

1. Go to **Render Dashboard**
2. Select your backend service
3. Click **"Environment"**
4. Update or add variable:
   ```
   CORS_ORIGINS=https://your-site.netlify.app
   ```
5. Scroll down and click **"Redeploy latest commit"**

---

## ✅ Done! Your App is Live!

| Component | URL |
|-----------|-----|
| **Frontend** | https://your-site.netlify.app |
| **Backend API** | https://face-recognition-backend.onrender.com |
| **API Docs** | https://face-recognition-backend.onrender.com/docs |

---

## 🧪 Testing Your Deployment

1. Open your Netlify frontend URL
2. Grant camera permissions when prompted
3. Test enrollment:
   - Go to "Enroll User"
   - Enter a name
   - Click "Initialize Camera"
   - Click "Register Identity"
4. Test recognition:
   - Go to "Attendance"
   - Click "Initialize Camera"
   - Click "Identify Face"
5. View records:
   - Go to "History" to see attendance logs

---

## 🐛 Troubleshooting

### "Camera not working"
- Check browser permissions (camera access)
- Ensure HTTPS (Netlify/Render both use HTTPS)
- Try a different browser

### "API not responding"
- Check that backend URL is correct in `.env.production`
- Verify Render backend is running (check Render logs)
- Wait for cold start (first request may take 30 seconds)

### "CORS Error"
- Verify `CORS_ORIGINS` in Render environment variables matches your Netlify URL
- Redeploy Render backend after updating variables

### "Build failed on Netlify"
- Check build logs in Netlify dashboard
- Ensure `npm run build` works locally:
  ```bash
  cd frontend
  npm run build
  ```

### "Backend not deploying"
- Check Render logs for errors
- Ensure `Dockerfile` exists in backend directory
- Verify all Python dependencies in `requirements.txt`

---

## 📋 Environment Files Reference

### `frontend/.env.production`
```
VITE_API_URL=https://face-recognition-backend.onrender.com
```

### `backend/.env` (Render Environment Variables)
```
PORT=8000
CORS_ORIGINS=https://your-site.netlify.app
```

---

## 💡 Pro Tips

1. **Free Tier Cold Starts**: Render free tier sleeps after 15 minutes
   - First request after sleep takes 30+ seconds
   - Upgrade to Hobby plan ($7/month) to avoid this

2. **Database**: Currently uses SQLite
   - Files won't persist on Render
   - Consider upgrading to PostgreSQL ($12/month on Render)

3. **File Uploads**: Current setup doesn't persist uploads
   - For production, integrate AWS S3 or similar

4. **Monitoring**: Set up error tracking
   - Sentry (free tier available)
   - Render error logs
   - Netlify error logs

---

## 📚 Useful Links

- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

## 🎯 Next Steps

1. ✅ Deploy backend on Render
2. ✅ Update frontend API URL
3. ✅ Deploy frontend on Netlify
4. ✅ Configure CORS on Render
5. ✅ Test all features
6. 📊 (Optional) Set up monitoring and alerts
7. 🔒 (Optional) Add authentication for security
8. 💾 (Optional) Migrate to PostgreSQL for persistence

Enjoy your live application! 🎉
