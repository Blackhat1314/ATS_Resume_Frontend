# Resume ATS Score Analyzer

A modern web application that analyzes resumes against job descriptions using AI to provide ATS (Applicant Tracking System) scoring and improvement suggestions.

## Features

- 📄 **PDF Resume Upload** - Upload your resume in PDF format
- 📝 **Job Description Analysis** - Paste job descriptions for comparison
- 🤖 **AI-Powered Analysis** - Uses Google Gemini AI for comprehensive analysis
- 📊 **ATS Score** - Get a percentage score (0-100%) indicating resume match
- 🔍 **Keyword Analysis** - See matched and missing keywords
- 💡 **Improvement Suggestions** - Get actionable recommendations
- ✨ **Optimized Bullet Points** - AI-generated improved resume bullets
- 🔄 **Retry System** - Automatic retry on API failures

## Project Structure

```
my-app/
├── backend/           # Node.js backend server
│   ├── server.js     # Express server with Gemini API integration
│   ├── package.json  # Backend dependencies
│   └── uploads/      # Temporary PDF storage (auto-created)
├── src/              # React frontend
│   ├── App.jsx       # Main application component
│   ├── App.css       # Application styles
│   └── main.jsx      # React entry point
└── package.json      # Frontend dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```bash
cd backend
cp .env.example .env
```
Then edit `.env` and add your Gemini API key. Get your API key from: https://makersuite.google.com/app/apikey

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the root directory (if not already there):
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **Start both servers** (backend and frontend)
2. **Open the application** in your browser
3. **Upload your resume** as a PDF file
4. **Paste the job description** in the text area
5. **Click "Analyze Resume"** to get your ATS score and detailed analysis

## Analysis Output

The application provides:

1. **ATS Match Score** - Overall percentage score
2. **Summary of Fit** - Brief overview of resume-job match
3. **Matched Keywords** - Keywords found in both resume and JD
4. **Missing Keywords** - Important keywords missing from resume
5. **Responsibility Match** - Areas covered and missing
6. **Gap Analysis** - Detailed gaps in experience, tech stack, etc.
7. **Improvement Suggestions** - Actionable recommendations
8. **Improved Bullet Points** - AI-rewritten resume bullets
9. **Final Verdict** - Recommendation on whether to apply

## API Endpoints

### POST `/api/analyze-resume`

Analyzes a resume against a job description.

**Request:**
- `resume`: PDF file (multipart/form-data)
- `jobDescription`: Text string

**Response:**
```json
{
  "success": true,
  "data": {
    "atsScore": 85,
    "summaryOfFit": "...",
    "matchedKeywords": [...],
    "missingKeywords": [...],
    ...
  }
}
```

### GET `/api/health`

Health check endpoint.

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **PDF Processing**: pdf-parse
- **File Upload**: Multer

## Notes

- PDF files are temporarily stored during processing and automatically deleted after analysis
- The API includes automatic retry logic (3 attempts) for reliability
- Maximum file size: 10MB

## Troubleshooting

- **Backend not starting**: Check if port 3001 is available
- **API errors**: Verify your Gemini API key is correct
- **PDF upload fails**: Ensure the PDF contains readable text (not just images)
- **CORS errors**: Make sure backend is running and CORS is enabled
