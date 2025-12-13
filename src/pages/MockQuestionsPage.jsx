import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config';
import '../App.css';

function MockQuestionsPage({ token, onLogout }) {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [manualYearsOfExperience, setManualYearsOfExperience] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [yearsOfExperience, setYearsOfExperience] = useState(null);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError(null);
    } else {
      setError('Please upload a PDF file');
      setResumeFile(null);
    }
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  const handleGenerateQuestions = async () => {
    if (!resumeFile) {
      setError('Please upload a resume PDF');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (!manualYearsOfExperience || parseFloat(manualYearsOfExperience) <= 0) {
      setError('Please enter a valid years of experience (greater than 0)');
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions(null);
    setLogs([]);

    try {
      addLog('Starting question generation...');
      addLog('Uploading resume and job description...');

      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);
      formData.append('yearsOfExperience', manualYearsOfExperience);
      formData.append('companyName', companyName.trim());

      addLog('Sending request to server...');

      const response = await fetch(getApiUrl('api/mock-questions'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      addLog(`Server response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        addLog(`Error: ${errorData.message || 'Failed to generate questions'}`);
        throw new Error(errorData.message || 'Failed to generate questions');
      }

      addLog('Parsing response...');
      const result = await response.json();
      
      if (result.data?.questions) {
        setQuestions(result.data.questions);
        setYearsOfExperience(result.data.yearsOfExperience || null);
        if (result.data.questions.companyName) {
          addLog(`Company identified: ${result.data.questions.companyName}`);
        }
        addLog('Questions generated successfully!');
        const totalQuestions = 
          (result.data.questions.jobDescriptionBased?.easy?.length || 0) +
          (result.data.questions.jobDescriptionBased?.medium?.length || 0) +
          (result.data.questions.jobDescriptionBased?.hard?.length || 0) +
          (result.data.questions.resumeBased?.easy?.length || 0) +
          (result.data.questions.resumeBased?.medium?.length || 0) +
          (result.data.questions.resumeBased?.hard?.length || 0) +
          (result.data.questions.dsaAndSystemDesign?.dsa?.length || 0) +
          (result.data.questions.dsaAndSystemDesign?.systemDesign?.length || 0);
        addLog(`Total questions: ${totalQuestions}`);
      } else {
        addLog('Warning: No questions in response');
        setQuestions(null);
      }
    } catch (err) {
      addLog(`Error: ${err.message}`);
      setError(err.message || 'An error occurred while generating questions');
    } finally {
      setLoading(false);
      addLog('Question generation process completed.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🎤 Mock Interview Questions</h1>
            <p>Generate categorized interview questions based on your resume and job description</p>
          </div>
          <div className="header-actions">
            <button className="nav-button" onClick={() => navigate('/')}>
              Resume Analysis
            </button>
            <button className="logout-button" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            color: 'white'
          }}>
            <div style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '20px',
              textAlign: 'center',
              color: '#333',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: '400px',
              width: '90%'
            }}>
              <div className="spinner" style={{
                width: '60px',
                height: '60px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                margin: '0 auto 1.5rem'
              }}></div>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Generating Questions</h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>This may take a few moments...</p>
              {logs.length > 0 && (
                <div style={{
                  background: '#1a1a1a',
                  color: '#0f0',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.85rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  textAlign: 'left',
                  marginTop: '1rem'
                }}>
                  {logs.slice(-5).map((log, idx) => (
                    <div key={idx} style={{ marginBottom: '0.25rem' }}>{log}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {!questions ? (
          <div className="input-section">
            <div className="upload-section">
              <label htmlFor="resume-upload" className="upload-label">
                <div className="upload-box">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p className="upload-text">
                    {resumeFile ? resumeFile.name : 'Upload Resume (PDF)'}
                  </p>
                  {resumeFile && <span className="file-size">{(resumeFile.size / 1024).toFixed(2)} KB</span>}
                </div>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>

            <div className="job-description-section">
              <label htmlFor="job-description" className="label">
                Job Description
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="textarea"
                rows="10"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="years-of-experience" className="label" style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                Years of Experience *
              </label>
              <input
                id="years-of-experience"
                type="number"
                min="0"
                step="0.5"
                value={manualYearsOfExperience}
                onChange={(e) => setManualYearsOfExperience(e.target.value)}
                placeholder="Enter your years of experience (e.g., 2.5, 5)"
                className="form-group input"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                This will be used to tailor question difficulty levels
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="company-name" className="label" style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                Company Name (Optional)
              </label>
              <input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name (e.g., Google, Amazon, Microsoft)"
                className="form-group input"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                If provided, DSA questions will be company-specific from LeetCode
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              onClick={handleGenerateQuestions}
              disabled={loading || !resumeFile || !jobDescription.trim() || !manualYearsOfExperience || parseFloat(manualYearsOfExperience) <= 0}
              className="analyze-button"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating Questions...
                </>
              ) : (
                'Generate Mock Questions'
              )}
            </button>

            {logs.length > 0 && (
              <div className="logs-section">
                <h3>Generation Logs</h3>
                <div className="logs-container">
                  {logs.map((log, idx) => (
                    <div key={idx} className="log-entry">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="results-section">
            <button
              onClick={() => {
                setQuestions(null);
                setResumeFile(null);
                setJobDescription('');
                setManualYearsOfExperience('');
                setCompanyName('');
                setLogs([]);
                setYearsOfExperience(null);
              }}
              className="back-button"
            >
              ← Generate New Questions
            </button>

            {(yearsOfExperience || (questions && questions.companyName)) && (
              <div style={{ 
                background: '#f8f9ff', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '2rem',
                textAlign: 'center',
                color: '#333',
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                {yearsOfExperience && <strong>Candidate Experience: {yearsOfExperience} years</strong>}
                {questions && questions.companyName && <strong>Company: {questions.companyName}</strong>}
              </div>
            )}

            {/* Job Description Based Questions */}
            <div className="result-section">
              <h2>📋 Job Description Based Questions</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Questions based on the job requirements, responsibilities, and skills mentioned in the job description
              </p>
              
              {questions.jobDescriptionBased?.easy?.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ 
                    color: '#10b981', 
                    fontSize: '1.5rem', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>EASY</span>
                    ({questions.jobDescriptionBased.easy.length} questions)
                  </h3>
                  <ol className="mock-questions-list">
                    {questions.jobDescriptionBased.easy.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: '0.75rem' }}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}

              {questions.jobDescriptionBased?.medium?.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ 
                    color: '#f59e0b', 
                    fontSize: '1.5rem', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      background: '#f59e0b', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>MEDIUM</span>
                    ({questions.jobDescriptionBased.medium.length} questions)
                  </h3>
                  <ol className="mock-questions-list">
                    {questions.jobDescriptionBased.medium.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: '0.75rem' }}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}

              {questions.jobDescriptionBased?.hard?.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ 
                    color: '#ef4444', 
                    fontSize: '1.5rem', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>HARD</span>
                    ({questions.jobDescriptionBased.hard.length} questions)
                  </h3>
                  <ol className="mock-questions-list">
                    {questions.jobDescriptionBased.hard.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: '0.75rem' }}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Resume Based Questions */}
            <div className="result-section">
              <h2>📄 Resume Based Questions</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Questions based on your actual experience, projects, and skills mentioned in your resume
              </p>
              
              {questions.resumeBased?.easy?.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ 
                    color: '#10b981', 
                    fontSize: '1.5rem', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>EASY</span>
                    ({questions.resumeBased.easy.length} questions)
                  </h3>
                  <ol className="mock-questions-list">
                    {questions.resumeBased.easy.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: '0.75rem' }}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}

              {questions.resumeBased?.medium?.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ 
                    color: '#f59e0b', 
                    fontSize: '1.5rem', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      background: '#f59e0b', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>MEDIUM</span>
                    ({questions.resumeBased.medium.length} questions)
                  </h3>
                  <ol className="mock-questions-list">
                    {questions.resumeBased.medium.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: '0.75rem' }}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}

              {questions.resumeBased?.hard?.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ 
                    color: '#ef4444', 
                    fontSize: '1.5rem', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>HARD</span>
                    ({questions.resumeBased.hard.length} questions)
                  </h3>
                  <ol className="mock-questions-list">
                    {questions.resumeBased.hard.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: '0.75rem' }}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* DSA and System Design Section */}
            {questions.dsaAndSystemDesign && (
              <div className="result-section">
                <h2>💻 DSA & System Design Questions</h2>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  {questions.companyName 
                    ? `Real LeetCode questions commonly asked at ${questions.companyName} interviews, tailored to your ${yearsOfExperience} years of experience`
                    : `Real LeetCode questions tailored to your ${yearsOfExperience} years of experience`}
                </p>
                <p style={{ 
                  color: '#8b5cf6', 
                  marginBottom: '2rem', 
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  background: '#f3f4f6',
                  padding: '0.75rem',
                  borderRadius: '8px'
                }}>
                  📌 DSA questions are actual LeetCode problems - search for them on leetcode.com to practice!
                </p>
                
                {questions.dsaAndSystemDesign.dsa?.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ 
                      color: '#8b5cf6', 
                      fontSize: '1.5rem', 
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ 
                        background: '#8b5cf6', 
                        color: 'white', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                      }}>DSA</span>
                      ({questions.dsaAndSystemDesign.dsa.length} questions)
                    </h3>
                    <ol className="mock-questions-list">
                      {questions.dsaAndSystemDesign.dsa.map((q, idx) => (
                        <li key={idx} style={{ marginBottom: '0.75rem' }}>{q}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {questions.dsaAndSystemDesign.systemDesign?.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ 
                      color: '#06b6d4', 
                      fontSize: '1.5rem', 
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ 
                        background: '#06b6d4', 
                        color: 'white', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                      }}>SYSTEM DESIGN</span>
                      ({questions.dsaAndSystemDesign.systemDesign.length} question)
                    </h3>
                    <ol className="mock-questions-list">
                      {questions.dsaAndSystemDesign.systemDesign.map((q, idx) => (
                        <li key={idx} style={{ marginBottom: '0.75rem' }}>{q}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default MockQuestionsPage;

