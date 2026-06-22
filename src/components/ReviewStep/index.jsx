import ResumeForm from '../ResumeForm'

export default function ReviewStep({ resumeData, onChange, onConfirm, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
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
            Start over
          </button>
          <button
            onClick={onConfirm}
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Looks good — continue editing →
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-800 mb-1">
            Review extracted information
          </p>
          <p className="text-sm text-amber-700">
            AI extracted this data from your uploaded file. Check for errors or missing details
            before continuing — you can edit everything here or after.
          </p>
        </div>

        <ResumeForm resumeData={resumeData} onChange={onChange} />

        <div className="mt-6 flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-gray-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Confirm & continue editing →
          </button>
        </div>
      </main>
    </div>
  )
}
