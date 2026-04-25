# Deployment Checklist

## Pre-Deployment (Local Testing)
- [ ] Run tests locally: `npm run dev` (frontend) and `python main.py` (backend)
- [ ] Test all features: enrollment, recognition, attendance records
- [ ] Check for any console errors in browser DevTools
- [ ] Verify API calls in Network tab

## Backend Deployment on Render

### Prerequisites
- [ ] GitHub account with repository pushed
- [ ] Render account created (render.com)
- [ ] GitHub connected to Render

### Deployment Steps
- [ ] Go to https://render.com/dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Select your GitHub repository
- [ ] Set configuration:
  - [ ] Name: `face-recognition-backend`
  - [ ] Environment: `Docker`
  - [ ] Region: Select your region
  - [ ] Branch: `main`
- [ ] Add Environment Variables:
  - [ ] `PORT=8000`
  - [ ] `CORS_ORIGINS=https://your-frontend.netlify.app` (add after frontend deployment)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy the backend URL (e.g., `https://face-recognition-backend.onrender.com`)

### Verification
- [ ] Visit `https://your-backend.onrender.com/docs` to see Swagger UI
- [ ] Backend is responding to requests

---

## Frontend Deployment on Netlify

### Prerequisites
- [ ] Backend deployed on Render (you have the URL)
- [ ] Netlify account created (netlify.com)
- [ ] GitHub connected to Netlify

### Before Deploying
- [ ] Update `frontend/.env.production`:
  ```
  VITE_API_URL=https://your-backend.onrender.com
  ```
- [ ] Commit and push to GitHub:
  ```bash
  git add .env.production
  git commit -m "Update production API URL"
  git push origin main
  ```

### Deployment Steps
- [ ] Go to https://app.netlify.com
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Select GitHub and authorize
- [ ] Choose your repository
- [ ] Configure settings:
  - [ ] Base directory: `frontend`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `frontend/dist`
- [ ] Click "Deploy site"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy the frontend URL (e.g., `https://your-site.netlify.app`)

### Post-Deployment Configuration
- [ ] Go back to Render backend settings
- [ ] Update environment variables:
  - [ ] `CORS_ORIGINS=https://your-site.netlify.app`
- [ ] Trigger a redeploy on Render

### Verification
- [ ] Visit your frontend URL
- [ ] Test camera initialization
- [ ] Test face enrollment
- [ ] Test recognition
- [ ] Check browser console for errors
- [ ] Check Network tab to verify API calls succeed

---

## Production Optimization

### Backend (Render)
- [ ] Upgrade to paid plan for always-on service (optional)
- [ ] Set up error monitoring
- [ ] Configure backup strategy for database
- [ ] Monitor cold start performance

### Frontend (Netlify)
- [ ] Enable caching headers in Netlify settings
- [ ] Set up analytics if desired
- [ ] Monitor performance metrics

---

## Troubleshooting

### CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS`
- **Solution**: Ensure `CORS_ORIGINS` on Render matches your Netlify URL
- Redeploy Render backend after updating

### 502 Bad Gateway
**Error**: Backend returns 502 error
- **Solution**: Check Render logs for errors
- Ensure all environment variables are set
- Verify database is accessible

### API Not Found
**Error**: Frontend can't reach backend
- **Solution**: Verify API URL in `.env.production`
- Check that backend is running on Render
- Ensure firewall isn't blocking requests

### Build Failures

**Netlify Build Fails**:
- Check build logs in Netlify dashboard
- Ensure `npm run build` works locally
- Verify all dependencies in `package.json`

**Render Build Fails**:
- Check Render logs
- Ensure `Dockerfile` is present
- Verify all Python dependencies in `requirements.txt`

---

## Useful Commands

```bash
# Test build locally
npm run build

# View Render logs
# (Use Render dashboard → Logs)

# View Netlify logs
# (Use Netlify dashboard → Deploys)

# Check if services are running
curl https://your-backend.onrender.com/docs
curl https://your-frontend.netlify.app
```

---

## Important Notes

- **Free Tiers**: Both Render and Netlify have free tiers with limitations
- **Cold Starts**: Render free tier sleeps after 15 minutes of inactivity
- **Database**: Currently using SQLite; consider PostgreSQL for production
- **File Uploads**: Render won't persist files; consider using cloud storage (AWS S3, etc.)
- **Security**: Add authentication for production use

---

## Support

- Render Support: https://render.com/support
- Netlify Support: https://support.netlify.com
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev
