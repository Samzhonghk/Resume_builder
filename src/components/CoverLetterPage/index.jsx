import { useState } from 'react'
import { generateCoverLetter } from '../../services/generateCoverLetter'
import { checkKeywords } from '../../services/checkKeywords'
import { downloadAsTxt, downloadAsPDF, downloadAsRtf } from '../../services/downloadCoverLetter'

export default function CoverLetterPage({ resumeData, onBack }) {
  const [jd, setJd] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'done' | 'error'
  const [coverLetter, setCoverLetter] = useState('')
  const [keywords, setKeywords] = useState([])
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const canAnalyse = jd.trim().length > 50

  function buildFilename() {
    return (
      [
        resumeData.data.name || 'cover-letter',
        company ? `-${company}` : '',
        jobTitle ? `-${jobTitle}` : '',
      ]
        .join('')
        .replace(/[^\w\s-]/g, '')
        .trim() || 'cover-letter'
    )
  }

  async function handleDownload(format) {
    setShowDownloadMenu(false)
    setDownloading(true)
    try {
      const filename = buildFilename()
      if (format === 'txt') downloadAsTxt(coverLetter, filename)
      else if (format === 'pdf') await downloadAsPDF(coverLetter, filename)
      else if (format === 'rtf') downloadAsRtf(coverLetter, filename)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(coverLetter).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleAnalyse() {
    setStatus('loading')
    setError(null)
    setCoverLetter('')
    setKeywords([])
    try {
      const [cl, kw] = await Promise.all([
        generateCoverLetter(resumeData, jd, jobTitle, company),
        checkKeywords(resumeData, jd),
      ])
      setCoverLetter(cl)
      setKeywords(kw)
      setStatus('done')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to resume
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-sm font-semibold text-gray-800">Cover Letter & Keyword Analysis</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* JD input */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={8}
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here…"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
            {jd.trim().length > 0 && jd.trim().length < 50 && (
              <p className="text-xs text-gray-400 mt-1">Paste more of the JD for better results.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Role <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Data Analyst"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Fonterra"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyse}
            disabled={!canAnalyse || status === 'loading'}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors text-sm"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating cover letter & analysing keywords…
              </>
            ) : (
              'Analyse with AI'
            )}
          </button>

          {status === 'error' && error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Results */}
        {status === 'done' && (
          <>
            {/* Cover Letter */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800">Cover Letter</h2>
                <div className="flex items-center gap-2">
                  {/* Download dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDownloadMenu(v => !v)}
                      disabled={downloading}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md px-3 py-1.5 hover:border-gray-300 transition-colors disabled:opacity-50"
                    >
                      {downloading ? (
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      Download
                      <svg className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {showDownloadMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowDownloadMenu(false)} />
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-40">
                          {[
                            { format: 'pdf', label: 'PDF (.pdf)' },
                            { format: 'rtf', label: 'Word / RTF (.rtf)' },
                            { format: 'txt', label: 'Plain text (.txt)' },
                          ].map(({ format, label }) => (
                            <button
                              key={format}
                              onClick={() => handleDownload(format)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Copy */}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md px-3 py-1.5 hover:border-gray-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-3">
                Review and personalise before sending. Each application deserves a fresh read.
              </p>
              <textarea
                rows={12}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            {/* Keyword gaps */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-1">Missing Keywords</h2>
              <p className="text-sm text-gray-500 mb-4">
                These terms appear in the JD but are absent or underrepresented in your resume.
                Consider weaving them in where genuine.
              </p>
              {keywords.length === 0 ? (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                  No significant keyword gaps found — your resume aligns well with this JD.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {keywords.map(kw => (
                    <span
                      key={kw}
                      className="bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center pb-4">
              You can change the JD above and click Analyse again to generate a new version.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
