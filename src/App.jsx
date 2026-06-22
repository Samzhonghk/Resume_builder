import { useState, useEffect, createElement } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import { createEmptyResume } from './types/resume'

const STORAGE_KEY = 'nz_resume_builder_v1'

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function safeFilename(name) {
  return (name || 'resume').replace(/[^\w\s-]/g, '').trim() || 'resume'
}

export default function App() {
  const [resumeData, setResumeData] = useState(() => loadFromStorage() ?? createEmptyResume())
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
  }, [resumeData])

  async function handleExportPDF() {
    setIsExporting(true)
    setExportError(null)
    try {
      const [{ pdf }, { default: ClassicTemplatePDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./components/ResumePreview/ClassicTemplatePDF'),
      ])
      const blob = await pdf(createElement(ClassicTemplatePDF, { data: resumeData })).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${safeFilename(resumeData.data.name)}-resume.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF export failed:', err)
      setExportError(err.message || 'PDF generation failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">NZ Resume Builder</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Create ATS-friendly resumes tailored for the New Zealand job market
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="xl:grid xl:grid-cols-2 xl:gap-8 xl:items-start">
          {/* Left: Form */}
          <div>
            <ResumeForm resumeData={resumeData} onChange={setResumeData} />

            {/* Mobile: export button (hidden on desktop — the preview panel has its own) */}
            <div className="mt-4 xl:hidden">
              <ExportButton loading={isExporting} onClick={handleExportPDF} full />
              {exportError && (
                <p className="mt-2 text-sm text-red-600">{exportError}</p>
              )}
            </div>
          </div>

          {/* Right: Preview + export button (xl+ only) */}
          <div className="hidden xl:block">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Live Preview</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    Classic Template
                  </span>
                  <ExportButton loading={isExporting} onClick={handleExportPDF} />
                </div>
              </div>
              <div className="rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-9rem)]">
                <ResumePreview data={resumeData} template="classic" />
              </div>
              {exportError && (
                <p className="mt-2 text-sm text-red-600">{exportError}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ExportButton({ loading, onClick, full }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={[
        'flex items-center gap-1.5 rounded-lg font-medium transition-colors',
        'bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
        full ? 'w-full justify-center py-3 px-4 text-sm' : 'px-3 py-1.5 text-xs',
      ].join(' ')}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  )
}
