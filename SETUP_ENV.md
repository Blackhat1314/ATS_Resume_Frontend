# Environment Variables Setup

## Quick Setup

### 1. Backend Setup

Navigate to `backend` directory and create `.env` file:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your actual values:

```env
PORT=3001
GEMINI_API_KEY=your_actual_gemini_api_key
JWT_SECRET=generate_a_secure_random_string
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**To generate a secure JWT_SECRET:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2. Frontend Setup

In the root directory, create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your backend URL:

```env
VITE_API_URL=http://localhost:3001
```

For production, update to your deployed backend URL:
```env
VITE_API_URL=https://your-backend-domain.com
```

## Important Notes

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **`.env.example` files are safe to commit** - They contain template values only
3. **Backend requires GEMINI_API_KEY** - The app will not start without it
4. **Update CORS_ORIGIN for production** - Set it to your frontend domain

## Testing

After setting up environment variables:

1. **Start backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start frontend:**
   ```bash
   npm install
   npm run dev
   ```

## Production Deployment

See `README_DEPLOYMENT.md` for detailed deployment instructions.


