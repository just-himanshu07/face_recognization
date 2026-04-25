# Step-by-Step Visual Deployment Guide

## Part 1: Backend Deployment on Render

### 1.1 Create Render Account
- Go to [render.com](https://render.com)
- Click "Sign up" → Choose "Sign up with GitHub"
- Authorize Render to access your GitHub account

### 1.2 Create Web Service
```
Dashboard → New + → Web Service
```

### 1.3 Connect Repository
```
Select: your Face recognition repository
Branch: main
```

### 1.4 Configure Service
```
Name: face-recognition-backend
Environment: Docker
Region: Choose your closest region (e.g., Frankfurt, Singapore)
```

**Leave these as default** (Render will auto-detect):
- Dockerfile path: `./Dockerfile`
- Build command: (auto-detected)

### 1.5 Add Environment Variables
```
PORT = 8000
```

### 1.6 Deploy
- Click "Create Web Service"
- Wait 5-10 minutes
- **Copy your backend URL**: `https://face-recognition-backend.onrender.com`

---

## Part 2: Update Frontend Environment

### 2.1 Update Configuration File
Edit `frontend/.env.production`:
```
VITE_API_URL=https://face-recognition-backend.onrender.com
```

### 2.2 Commit Changes
```bash
cd /home/himanshuraj/Downloads/HackRust/Face
git add .
git commit -m "Update frontend API URL for production"
git push origin main
```

---

## Part 3: Frontend Deployment on Netlify

### 3.1 Create Netlify Account
- Go to [netlify.com](https://netlify.com)
- Click "Sign up" → Choose "GitHub"
- Authorize Netlify

### 3.2 Create New Site
```
Sites → Add new site → Import an existing project → GitHub
```

### 3.3 Select Repository
- Repository: Face recognition project
- Owner: Your GitHub username

### 3.4 Configure Build
| Setting | Value |
|---------|-------|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |

### 3.5 Deploy
- Click "Deploy site"
- Wait 2-5 minutes
- **Copy your frontend URL**: `https://your-site.netlify.app`

---

## Part 4: Final Configuration

### 4.1 Update Render CORS
1. Go back to Render Dashboard
2. Select your backend service
3. Click "Environment"
4. Add/Update variable:
   ```
   CORS_ORIGINS=https://your-site.netlify.app
   ```
5. Click "Save" → "Redeploy latest commit"

### 4.2 Verify Deployment
- Frontend: Visit `https://your-site.netlify.app`
- Backend API: Visit `https://face-recognition-backend.onrender.com/docs`

---

## Testing Your Live Application

### Test 1: Page Load
```
✅ Frontend loads without errors
✅ No CORS errors in console
✅ API URL is correct
```

### Test 2: Camera Access
```
✅ Click "Initialize Camera"
✅ Browser asks for camera permission
✅ Camera preview appears
```

### Test 3: Enrollment
```
✅ Enter name (e.g., "John Doe")
✅ Click "Register Identity"
✅ Check "Directory" tab - user appears
```

### Test 4: Recognition
```
✅ Go to "Attendance" tab
✅ Click "Identify Face"
✅ System recognizes enrolled face
✅ Check "History" - attendance logged
```

### Test 5: API
```
✅ Visit backend /docs page
✅ Try "GET /users" - shows enrolled users
✅ Try "GET /attendance" - shows logs
```

---

## Monitoring & Logs

### View Render Logs
```
Render Dashboard → Your Service → Logs
```

Shows:
- Server startup messages
- API requests
- Errors and warnings

### View Netlify Logs
```
Netlify Dashboard → Deploys → Latest Deploy → Deploy log
```

Shows:
- Build output
- npm install progress
- Build success/failure

---

## Common Issues & Solutions

### Issue 1: CORS Error in Console
```
Error: Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
1. Check Render environment: `CORS_ORIGINS` should match your Netlify URL exactly
2. Redeploy Render backend
3. Wait 1-2 minutes for changes to take effect
4. Refresh your frontend

### Issue 2: Backend Not Responding
```
Error: Failed to fetch from API
```

**Solution**:
1. Check Render logs for errors
2. Verify backend URL in `frontend/.env.production`
3. Wait for cold start (first request may take 30+ seconds)
4. Check if Render service has sufficient memory

### Issue 3: Build Failed on Netlify
```
Build failed: npm install or npm run build failed
```

**Solution**:
1. Check Netlify build logs
2. Verify dependencies in `package.json`
3. Run locally: `cd frontend && npm run build`
4. Fix errors and push to GitHub
5. Netlify will auto-redeploy

### Issue 4: Camera Permission Denied
```
Camera access denied
```

**Solution**:
1. Check browser camera permissions
2. Allow camera for the Netlify domain
3. Use HTTPS (Netlify automatically provides this)
4. Try different browser

---

## Performance Optimization

### Render Backend
- **Cold starts**: First request after sleep (15 min) takes 30+ seconds
- **Solution**: Upgrade to Hobby tier ($7/month) for always-on

### Netlify Frontend
- **Caching**: Already optimized by default
- **CDN**: Automatically distributed globally
- **Performance**: Check Netlify Analytics dashboard

---

## Security Considerations

### Currently No Authentication
Your app is open to everyone. For production:
1. Add user login system
2. Secure API endpoints
3. Use API keys for attendance endpoint
4. Enable HTTPS (already done)

### Database
- Currently using SQLite (in-memory on Render)
- **Upgrade to PostgreSQL** for data persistence ($12/month)

---

## Upgrading to Paid Tiers

### Render Hobby Tier ($7/month)
- Always-on service (no cold starts)
- More reliable performance
- Recommended for production

### Netlify Pro ($20/month)
- Additional build minutes
- Advanced analytics
- Email support

---

## File Structure After Deployment

```
Your GitHub Repository
├── frontend/
│   ├── .env.production      ← Production API URL
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── backend/
│   ├── Dockerfile           ← For Render deployment
│   ├── requirements.txt
│   ├── main.py
│   └── ...
├── DEPLOYMENT.md            ← Full deployment guide
├── QUICKSTART_DEPLOYMENT.md ← Quick setup guide
└── README.md
```

---

## Checking Your URLs

### After Backend Deployment
```
Your Backend URL: https://face-recognition-backend.onrender.com
API Docs: https://face-recognition-backend.onrender.com/docs
```

### After Frontend Deployment
```
Your Frontend URL: https://your-site.netlify.app
```

---

## Support Links

- **Render Docs**: https://render.com/docs
- **Render Support**: https://support.render.com
- **Netlify Docs**: https://docs.netlify.com
- **Netlify Support**: https://support.netlify.com

---

## Summary

| Step | Time | Status |
|------|------|--------|
| Deploy Backend on Render | 10 min | ✅ |
| Update Frontend Config | 2 min | ✅ |
| Deploy Frontend on Netlify | 5 min | ✅ |
| Update CORS Settings | 2 min | ✅ |
| Test Application | 5 min | ✅ |
| **Total** | **24 min** | **✅ Complete** |

Your application is now live on the internet! 🎉
