# Environment Variables Setup Instructions

## ✅ Files Created

1. **`backend/.env`** - Actual environment file for backend (add your credentials here)
2. **`backend/.env.example`** - Template file (safe to commit to git)
3. **`.env`** - Actual environment file for frontend (add your backend URL here)
4. **`.env.example`** - Template file (safe to commit to git)

## 🔒 Security Status

✅ Both `.env` files are already in `.gitignore` and will NOT be committed to git
✅ Only `.env.example` files will be committed (they contain no real credentials)

## 📝 Next Steps - Add Your Credentials

### 1. Backend Credentials (`backend/.env`)

Open `backend/.env` and fill in:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
JWT_SECRET=your_secure_random_string_here
```

**To get Gemini API Key:**
- Visit: https://makersuite.google.com/app/apikey
- Create a new API key
- Copy and paste it into `GEMINI_API_KEY=`

**To generate JWT_SECRET:**
- **Windows PowerShell:**
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  ```
- **Linux/Mac:**
  ```bash
  openssl rand -base64 32
  ```

### 2. Frontend Configuration (`.env`)

The frontend `.env` is already set for local development:
```env
VITE_API_URL=http://localhost:3001
```

For production, update it to your backend URL:
```env
VITE_API_URL=https://your-backend-domain.com
```

## ✅ Verification

After adding your credentials, verify:

1. **Backend .env has:**
   - ✅ GEMINI_API_KEY (not empty)
   - ✅ JWT_SECRET (not empty)

2. **Files are ignored by git:**
   - ✅ `.env` files are in `.gitignore`
   - ✅ They won't be committed accidentally

## 🚀 Testing

1. Start backend:
   ```bash
   cd backend
   npm start
   ```

2. Start frontend:
   ```bash
   npm run dev
   ```

## ⚠️ Important Notes

- **Never commit `.env` files** - They contain sensitive credentials
- **Only commit `.env.example` files** - They are templates
- **Keep your API keys secure** - Don't share them publicly
- **Use different keys for development and production**


