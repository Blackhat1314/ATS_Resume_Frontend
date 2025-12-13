# Deployment Guide

This guide will help you deploy the Resume ATS Analyzer application to production.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key
- A hosting service (e.g., Vercel, Netlify, Railway, Render, etc.)

## Environment Variables Setup

### Backend Environment Variables

1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and fill in your values:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   JWT_SECRET=your_secure_random_jwt_secret_here
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

### Frontend Environment Variables

1. In the root directory, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and set your backend URL:
   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```

## Deployment Steps

### Option 1: Deploy Backend and Frontend Separately

#### Backend Deployment (e.g., Railway, Render, Heroku)

1. **Prepare backend:**
   - Ensure `backend/package.json` has a `start` script
   - Set environment variables in your hosting platform

2. **Deploy:**
   - Connect your repository
   - Set root directory to `backend`
   - Add environment variables in the platform settings
   - Deploy

#### Frontend Deployment (e.g., Vercel, Netlify)

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Connect your repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable `VITE_API_URL` in platform settings
   - Deploy

### Option 2: Deploy as Monorepo

Some platforms support deploying both frontend and backend from the same repository.

## Environment Variables Checklist

### Backend (.env in backend/)
- ✅ `GEMINI_API_KEY` - Required
- ✅ `JWT_SECRET` - Required (use a strong random string)
- ✅ `PORT` - Optional (defaults to 3001)
- ✅ `CORS_ORIGIN` - Required (your frontend URL)

### Frontend (.env in root/)
- ✅ `VITE_API_URL` - Required (your backend URL)

## Security Notes

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **Set CORS_ORIGIN properly** - Don't use `*` in production
4. **Keep API keys secure** - Never expose them in client-side code

## Testing Production Build

### Test Backend Locally:
```bash
cd backend
npm install
npm start
```

### Test Frontend Locally:
```bash
npm install
npm run build
npm run preview
```

## Common Issues

### CORS Errors
- Make sure `CORS_ORIGIN` in backend includes your frontend URL
- Check that URLs don't have trailing slashes

### API Connection Errors
- Verify `VITE_API_URL` points to your deployed backend
- Check backend logs for errors
- Ensure backend is running and accessible

### Environment Variables Not Loading
- Restart your deployment after adding environment variables
- For Vite, ensure variables start with `VITE_`
- Check that `.env` files are in the correct directories

## Support

For issues, check:
1. Backend logs
2. Frontend console errors
3. Network tab for API requests
4. Environment variable configuration


