import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config';
import '../App.css';

function AnalysisPage({ token, onLogout }) {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

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

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('Please upload a resume PDF');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setLogs([]);

    try {
      addLog('Starting resume analysis...');
      addLog('Preparing resume and job description...');
      
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      addLog('Uploading files to server...');
      const response = await fetch(getApiUrl('api/analyze-resume'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      addLog(`Server response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        addLog(`Error: ${errorData.message || 'Failed to analyze resume'}`);
        throw new Error(errorData.message || 'Failed to analyze resume');
      }

      addLog('Parsing analysis results...');
      const result = await response.json();
      addLog('Analysis completed successfully!');
      setAnalysisResult(result.data);
      setFileId(result.data.fileId);
    } catch (err) {
      addLog(`Error: ${err.message}`);
      setError(err.message || 'An error occurred while analyzing the resume');
    } finally {
      setLoading(false);
      addLog('Analysis process completed.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const handleGenerateImprovedPdf = async () => {
    if (!fileId || !analysisResult) {
      setError('Missing file information. Please re-analyze your resume.');
      return;
    }

    setGeneratingPdf(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('api/generate-improved-resume'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileId: fileId,
          missingKeywords: analysisResult.missingKeywords || [],
          improvementSuggestions: analysisResult.improvementSuggestions || [],
          jobDescription: jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate improved PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'improved-resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || 'An error occurred while generating the improved PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>📄 Resume ATS Score Analyzer</h1>
            <p>Get instant feedback on how well your resume matches job descriptions</p>
          </div>
          <div className="header-actions">
            <button className="nav-button" onClick={() => navigate('/mock-questions')}>
              Mock Questions
            </button>
            <button className="logout-button" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {!analysisResult ? (
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

            {error && <div className="error-message">{error}</div>}

            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeFile || !jobDescription.trim()}
              className="analyze-button"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
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
                setAnalysisResult(null);
                setResumeFile(null);
                setJobDescription('');
                setLogs([]);
              }}
              className="back-button"
            >
              ← Analyze Another Resume
            </button>

            {/* Overview Section - Same as before */}
            <div className="overview-section">
              <div className="overview-left">
                <h2 className="overview-title">Overview</h2>
                <div className="match-score-display">
                  <span className="match-score-label">Match Score: </span>
                  <span className="match-score-value" style={{ color: getScoreColor(analysisResult.overview?.matchScore || analysisResult.atsScore) }}>
                    {analysisResult.overview?.matchScore || analysisResult.atsScore}
                  </span>
                </div>
                <p className="overview-summary">
                  {analysisResult.overview?.summary || analysisResult.summaryOfFit}
                </p>
                
                {analysisResult.overview?.radarScores && (
                  <div className="radar-chart-container">
                    <div className="radar-chart">
                      <svg viewBox="0 0 200 200" className="radar-svg">
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
                        <circle cx="100" cy="100" r="60" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
                        <line x1="100" y1="100" x2="100" y2="20" stroke="#e0e0e0" strokeWidth="1"/>
                        <line x1="100" y1="100" x2="170" y2="100" stroke="#e0e0e0" strokeWidth="1"/>
                        <line x1="100" y1="100" x2="30" y2="100" stroke="#e0e0e0" strokeWidth="1"/>
                        <line x1="100" y1="100" x2="65" y2="165" stroke="#e0e0e0" strokeWidth="1"/>
                        <line x1="100" y1="100" x2="135" y2="165" stroke="#e0e0e0" strokeWidth="1"/>
                        <polygon
                          points={`100,${100 - (analysisResult.overview.radarScores.content || 0) * 0.8} 
                                  ${100 + (analysisResult.overview.radarScores.format || 0) * 0.8 * Math.cos(Math.PI * 2 / 5)},${100 - (analysisResult.overview.radarScores.format || 0) * 0.8 * Math.sin(Math.PI * 2 / 5)}
                                  ${100 + (analysisResult.overview.radarScores.style || 0) * 0.8 * Math.cos(Math.PI * 4 / 5)},${100 - (analysisResult.overview.radarScores.style || 0) * 0.8 * Math.sin(Math.PI * 4 / 5)}
                                  ${100 + (analysisResult.overview.radarScores.sections || 0) * 0.8 * Math.cos(Math.PI * 6 / 5)},${100 - (analysisResult.overview.radarScores.sections || 0) * 0.8 * Math.sin(Math.PI * 6 / 5)}
                                  ${100 + (analysisResult.overview.radarScores.skills || 0) * 0.8 * Math.cos(Math.PI * 8 / 5)},${100 - (analysisResult.overview.radarScores.skills || 0) * 0.8 * Math.sin(Math.PI * 8 / 5)}`}
                          fill="rgba(34, 197, 94, 0.3)"
                          stroke="#22c55e"
                          strokeWidth="2"
                        />
                      </svg>
                      <div className="radar-labels">
                        <div className="radar-label" style={{ top: '10px', left: '50%', transform: 'translateX(-50%)', color: '#3b82f6' }}>
                          <span className="label-marker" style={{ backgroundColor: '#3b82f6' }}></span>
                          Content
                        </div>
                        <div className="radar-label" style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', color: '#f59e0b' }}>
                          <span className="label-marker" style={{ backgroundColor: '#f59e0b' }}></span>
                          Format
                        </div>
                        <div className="radar-label" style={{ bottom: '10px', right: '10px', color: '#a855f7' }}>
                          <span className="label-marker" style={{ backgroundColor: '#a855f7' }}></span>
                          Style
                        </div>
                        <div className="radar-label" style={{ bottom: '10px', left: '10px', color: '#ef4444' }}>
                          <span className="label-marker" style={{ backgroundColor: '#ef4444' }}></span>
                          Sections
                        </div>
                        <div className="radar-label" style={{ top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#06b6d4' }}>
                          <span className="label-marker" style={{ backgroundColor: '#06b6d4' }}></span>
                          Skills
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="overview-right">
                <div className="highlights-box">
                  <h3 className="highlights-title">Highlights</h3>
                  <ul className="highlights-list">
                    {(analysisResult.overview?.highlights || []).map((highlight, idx) => (
                      <li key={idx}>
                        <span className="check-icon">✓</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="improvements-box">
                  <h3 className="improvements-title">Improvements</h3>
                  <ul className="improvements-list">
                    {(analysisResult.overview?.improvements || analysisResult.improvementSuggestions?.slice(0, 3) || []).map((improvement, idx) => (
                      <li key={idx}>
                        <span className="check-icon orange">✓</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {analysisResult.atsScore < 70 && (
              <div className="edit-resume-section">
                <div className="edit-resume-card">
                  <h2>✏️ Improve Your Resume</h2>
                  <p className="edit-resume-description">
                    Your ATS score is below 70%. Let AI enhance your resume by adding missing keywords and incorporating improvement suggestions to boost your score!
                  </p>
                  <button
                    onClick={handleGenerateImprovedPdf}
                    disabled={generatingPdf}
                    className="generate-pdf-button"
                  >
                    {generatingPdf ? (
                      <>
                        <span className="spinner"></span>
                        Generating Improved PDF...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Generate Improved Resume PDF
                      </>
                    )}
                  </button>
                  {error && <div className="error-message">{error}</div>}
                </div>
              </div>
            )}

            {/* Keywords Section */}
            {(analysisResult.matchedKeywords?.length > 0 || analysisResult.missingKeywords?.length > 0) && (
              <div className="result-section">
                <h2>🔑 Keywords Analysis</h2>
                <div className="keywords-grid">
                  {analysisResult.matchedKeywords?.length > 0 && (
                    <div className="keyword-section">
                      <h3>Matched Keywords</h3>
                      <div className="keyword-tags">
                        {analysisResult.matchedKeywords.map((keyword, idx) => (
                          <span key={idx} className="keyword-tag matched">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysisResult.missingKeywords?.length > 0 && (
                    <div className="keyword-section">
                      <h3>Missing Keywords</h3>
                      <div className="keyword-tags">
                        {analysisResult.missingKeywords.map((keyword, idx) => (
                          <span key={idx} className="keyword-tag missing">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills Comparison Section */}
            {analysisResult.skillsComparison?.length > 0 && (
              <div className="result-section">
                <h2>⚙️ Skills Comparison</h2>
                <div className="skills-table-container">
                  <table className="skills-table">
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th className="count-cell">Job Description</th>
                        <th className="count-cell">Resume</th>
                        <th className="status-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.skillsComparison.map((skill, idx) => (
                        <tr key={idx} className={skill.status === 'missing' ? 'skill-missing' : 'skill-matched'}>
                          <td className="skill-name">
                            {skill.skill}
                            {skill.required && <span className="required-badge">(Required)</span>}
                          </td>
                          <td className="count-cell">{skill.jobDescriptionCount || 0}</td>
                          <td className="count-cell">{skill.resumeCount || 0}</td>
                          <td className="status-cell">
                            {skill.status === 'matched' ? (
                              <span className="status-check">✓</span>
                            ) : (
                              <span className="status-x">✗</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Responsibility Match Section */}
            {analysisResult.responsibilityMatch && (
              <div className="result-section">
                <h2>📋 Responsibility Match</h2>
                <div className="match-details">
                  {analysisResult.responsibilityMatch.goodAreas?.length > 0 && (
                    <div className="match-item">
                      <h4>✅ Covered Areas</h4>
                      <ul>
                        {analysisResult.responsibilityMatch.goodAreas.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.responsibilityMatch.missingAreas?.length > 0 && (
                    <div className="match-item">
                      <h4>❌ Missing Areas</h4>
                      <ul>
                        {analysisResult.responsibilityMatch.missingAreas.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gap Analysis Section */}
            {analysisResult.gapAnalysis && (
              <div className="result-section">
                <h2>📊 Gap Analysis</h2>
                <div className="gap-analysis">
                  {analysisResult.gapAnalysis.experience && (
                    <div className="gap-item">
                      <strong>💼 Experience Gap</strong>
                      <p>{analysisResult.gapAnalysis.experience}</p>
                    </div>
                  )}
                  {analysisResult.gapAnalysis.techStack && (
                    <div className="gap-item">
                      <strong>🛠️ Tech Stack Gap</strong>
                      <p>{analysisResult.gapAnalysis.techStack}</p>
                    </div>
                  )}
                  {analysisResult.gapAnalysis.domainKnowledge && (
                    <div className="gap-item">
                      <strong>📚 Domain Knowledge Gap</strong>
                      <p>{analysisResult.gapAnalysis.domainKnowledge}</p>
                    </div>
                  )}
                  {analysisResult.gapAnalysis.certifications && (
                    <div className="gap-item">
                      <strong>🎓 Certifications Gap</strong>
                      <p>{analysisResult.gapAnalysis.certifications}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience Details Section */}
            {analysisResult.experienceDetails && (
              <div className="result-section">
                <h2>💼 Experience Details</h2>
                <div className="experience-details">
                  <div className="experience-summary">
                    <div>
                      <strong>Total Years of Experience:</strong> {analysisResult.experienceDetails.totalYears || 'N/A'} years
                    </div>
                    {analysisResult.experienceDetails.currentRole && (
                      <div>
                        <strong>Current Role:</strong> {analysisResult.experienceDetails.currentRole}
                      </div>
                    )}
                    {analysisResult.experienceDetails.includesInternships && (
                      <div>
                        <strong>Includes Internships:</strong> Yes
                      </div>
                    )}
                  </div>
                  {analysisResult.experienceDetails.positions?.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <strong style={{ display: 'block', marginBottom: '1rem' }}>Position Breakdown:</strong>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {analysisResult.experienceDetails.positions.map((position, idx) => (
                          <li key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
                            <strong>{position.title}</strong> at <strong>{position.company}</strong>
                            <br />
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>
                              {position.dates} • {position.duration}
                              {position.isCurrent && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>(Current)</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spelling and Grammar Section */}
            {analysisResult.spellingGrammar && (
              <div className="result-section">
                <h2>✍️ Spelling & Grammar Check</h2>
                <div className="spelling-grammar-section">
                  <div className="error-count">
                    Total Errors Found: {analysisResult.spellingGrammar.totalErrors || 0}
                  </div>
                  {analysisResult.spellingGrammar.errors?.length > 0 ? (
                    <div className="errors-list">
                      {analysisResult.spellingGrammar.errors.map((error, idx) => (
                        <div key={idx} className={`error-item ${error.type === 'grammar' ? 'grammar' : ''}`}>
                          <div className="error-header">
                            <span className="error-type-badge">
                              {error.type === 'spelling' ? 'Spelling' : 'Grammar'}
                            </span>
                            {error.word && <span className="error-word">{error.word}</span>}
                          </div>
                          {error.correction && (
                            <div className="error-correction">
                              <strong>Correction:</strong> {error.correction}
                            </div>
                          )}
                          {error.context && (
                            <div className="error-context">
                              Context: "{error.context}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#10b981', fontWeight: '600' }}>✓ No errors found! Your resume is error-free.</p>
                  )}
                </div>
              </div>
            )}

            {/* Improvement Suggestions Section */}
            {analysisResult.improvementSuggestions?.length > 0 && (
              <div className="result-section">
                <h2>💡 Improvement Suggestions</h2>
                <ul className="improvements-list" style={{ listStyle: 'none', padding: 0 }}>
                  {analysisResult.improvementSuggestions.map((suggestion, idx) => (
                    <li key={idx} style={{ marginBottom: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                      <span className="check-icon orange">✓</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rewritten Bullet Points Section */}
            {analysisResult.rewrittenBulletPoints?.length > 0 && (
              <div className="result-section">
                <h2>✨ Improved Bullet Points</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {analysisResult.rewrittenBulletPoints.map((bullet, idx) => (
                    <li key={idx} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9ff', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Final Verdict Section */}
            {analysisResult.finalVerdict && (
              <div className="result-section">
                <h2>🎯 Final Verdict</h2>
                <div className="summary-text">
                  {analysisResult.finalVerdict}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AnalysisPage;

