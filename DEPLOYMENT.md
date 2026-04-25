# Deployment Guide: Netlify + Render

## Backend Deployment on Render

### Step 1: Prepare Your Repository
Ensure your GitHub repository is up to date:
```bash
cd /home/himanshuraj/Downloads/HackRust/Face
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended for easy integration)
3. Authorize Render to access your repositories

### Step 3: Deploy Backend Service
1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repository (Face)
3. Configure the service:
   - **Name**: `face-recognition-backend` (or your choice)
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
4. Leave Docker settings as default (Render will detect `Dockerfile`)

### Step 4: Set Environment Variables
In the Render dashboard, go to **Environment** section and add:
```
PORT=8000
```

### Step 5: Deploy
Click **"Create Web Service"** and Render will automatically:
- Build the Docker image
- Deploy your FastAPI backend
- Provide a live URL (e.g., `https://face-recognition-backend.onrender.com`)

### Important Notes:
- First deployment takes 5-10 minutes
- Your backend URL will be: `https://face-recognition-backend.onrender.com`
- Free tier has cold starts (server sleeps after 15 min of inactivity)
- Upgrade to paid plan for always-on service

---

## Frontend Deployment on Netlify

### Step 1: Update API URL
Before deploying, update the frontend to use your Render backend URL.

Create a `.env.production` file in the frontend directory:

```bash
cat > frontend/.env.production << 'EOF'
VITE_API_URL=https://face-recognition-backend.onrender.com
EOF
```

Replace `face-recognition-backend` with your actual Render service name.

### Step 2: Create Netlify Account
1. Go to [https://netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### Step 3: Deploy Frontend
1. Click **"Add new site"** → **"Import an existing project"**
2. Select **GitHub** and choose your repository
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Click **"Deploy site"**

### Step 4: Set Environment Variables (Optional)
In Netlify dashboard:
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add environment variables:
   ```
   VITE_API_URL=https://face-recognition-backend.onrender.com
   ```

### Step 5: Monitor Deployment
- Netlify will automatically build and deploy
- Your frontend URL will be provided (e.g., `https://your-site.netlify.app`)

---

## Post-Deployment Checklist

- [ ] Backend URL is accessible at `https://your-backend.onrender.com/docs`
- [ ] Frontend loads at your Netlify URL
- [ ] Update CORS in backend if needed
- [ ] Test enrollment functionality
- [ ] Test recognition functionality
- [ ] Check browser console for any API errors

## Troubleshooting

### CORS Errors
If you get CORS errors, update backend `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.netlify.app"],  # Your Netlify URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Backend Not Responding
- Check Render logs: Dashboard → Your Service → "Logs"
- Ensure all environment variables are set
- Verify Docker build succeeded

### Frontend Not Finding Backend
- Confirm `.env.production` has correct API URL
- Check browser DevTools → Network tab for API calls
- Verify the backend URL is accessible

### Cold Start Issues (Free Render Tier)
- First request may take 30+ seconds
- Upgrade to paid plan for better performance
- Keep backend warmed with periodic requests

---

## Useful Links

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Vite Build Guide**: https://vitejs.dev/guide/build.html

## Next Steps

1. Push all changes to GitHub
2. Deploy backend on Render first
3. Get backend URL and update frontend `.env.production`
4. Deploy frontend on Netlify
5. Test all features in production
