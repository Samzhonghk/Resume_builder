export default function LandingPage({ onBlank, onUpload, hasExistingData, onContinue }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NZ Resume Builder</h1>
          <p className="text-gray-500">
            Create ATS-friendly resumes tailored for the New Zealand job market
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onBlank}
            className="w-full bg-gray-900 text-white rounded-xl py-4 px-6 text-left hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-base">Start from scratch</div>
                <div className="text-sm text-gray-300 mt-0.5">
                  Fill in your details and let AI write your bullet points
                </div>
              </div>
              <svg
                className="h-5 w-5 text-gray-400 group-hover:text-gray-200 flex-shrink-0 ml-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          <button
            onClick={onUpload}
            className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl py-4 px-6 text-left hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-base">Upload existing resume</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  PDF or Word — AI extracts and optimises your content
                </div>
              </div>
              <svg
                className="h-5 w-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0 ml-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          {hasExistingData && (
            <button
              onClick={onContinue}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
            >
              Continue editing previous resume →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
