import { useState, useEffect, createElement } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import LandingPage from './components/LandingPage'
import UploadFlow from './components/UploadFlow'
import ReviewStep from './components/ReviewStep'
import CoverLetterPage from './components/CoverLetterPage'
import { createEmptyResume } from './types/resume'

const STORAGE_KEY = 'nz_resume_builder_v1'
const TEMPLATE_KEY = 'nz_resume_builder_template'

const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
]

async function importTemplatePDF(template) {
  switch (template) {
    case 'modern': return import('./components/ResumePreview/ModernTemplatePDF')
    case 'minimal': return import('./components/ResumePreview/MinimalTemplatePDF')
    case 'professional': return import('./components/ResumePreview/ProfessionalTemplatePDF')
    case 'creative': return import('./components/ResumePreview/CreativeTemplatePDF')
    default: return import('./components/ResumePreview/ClassicTemplatePDF')
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function loadTemplate() {
  return localStorage.getItem(TEMPLATE_KEY) ?? 'classic'
}

function hasData(resumeData) {
  return !!(resumeData?.data?.name || resumeData?.data?.workExperience?.length > 0)
}

function safeFilename(name) {
  return (name || 'resume').replace(/[^\w\s-]/g, '').trim() || 'resume'
}

export default function App() {
  const [resumeData, setResumeData] = useState(() => loadFromStorage() ?? createEmptyResume())
  const [view, setView] = useState(() => (hasData(loadFromStorage()) ? 'form' : 'landing'))
  const [template, setTemplate] = useState(loadTemplate)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
  }, [resumeData])

  useEffect(() => {
    localStorage.setItem(TEMPLATE_KEY, template)
  }, [template])

  async function handleExportPDF() {
    setIsExporting(true)
    setExportError(null)
    try {
      const [{ pdf }, { default: TemplatePDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        importTemplatePDF(template),
      ])
      const blob = await pdf(createElement(TemplatePDF, { data: resumeData })).toBlob()
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

  function handleExtracted(structuredData) {
    setResumeData({ source: 'uploaded', targetIndustry: '', data: structuredData })
    setView('review')
  }

  if (view === 'landing') {
    return (
      <LandingPage
        onBlank={() => { setResumeData(createEmptyResume()); setView('form') }}
        onUpload={() => setView('upload')}
        hasExistingData={hasData(resumeData)}
        onContinue={() => setView('form')}
      />
    )
  }

  if (view === 'upload') {
    return <UploadFlow onComplete={handleExtracted} onCancel={() => setView('landing')} />
  }

  if (view === 'review') {
    return (
      <ReviewStep
        resumeData={resumeData}
        onChange={setResumeData}
        onConfirm={() => setView('form')}
        onBack={() => setView('landing')}
      />
    )
  }

  if (view === 'coverletter') {
    return <CoverLetterPage resumeData={resumeData} onBack={() => setView('form')} />
  }

  // view === 'form'
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <button
              onClick={() => setView('landing')}
              className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
            >
              NZ Resume Builder
            </button>
            <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">
              Create ATS-friendly resumes tailored for the New Zealand job market
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {resumeData.source === 'uploaded' && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100 hidden sm:inline">
                Uploaded resume
              </span>
            )}
            <button
              onClick={() => setView('coverletter')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-800 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Cover Letter
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="xl:grid xl:grid-cols-2 xl:gap-8 xl:items-start">
          {/* Left: Form */}
          <div>
            <ResumeForm resumeData={resumeData} onChange={setResumeData} />
            <div className="mt-4 xl:hidden">
              <ExportButton loading={isExporting} onClick={handleExportPDF} full />
              {exportError && <p className="mt-2 text-sm text-red-600">{exportError}</p>}
            </div>
          </div>

          {/* Right: Template selector + Preview (xl+) */}
          <div className="hidden xl:block">
            <div className="sticky top-20">
              {/* Template selector */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1">
                  {TEMPLATE_OPTIONS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={[
                        'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                        template === t.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-500 hover:text-gray-800',
                      ].join(' ')}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <ExportButton loading={isExporting} onClick={handleExportPDF} />
              </div>

              <div className="rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-9rem)]">
                <ResumePreview data={resumeData} template={template} />
              </div>
              {exportError && <p className="mt-2 text-sm text-red-600">{exportError}</p>}
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
