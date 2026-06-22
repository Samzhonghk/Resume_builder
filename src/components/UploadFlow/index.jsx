import { useState, useRef } from 'react'
import { parseResumeFile } from '../../services/parseResume'
import { extractStructure } from '../../services/extractStructure'

const ACCEPTED = '.pdf,.docx'

const STATUS_LABEL = {
  parsing: 'Reading file…',
  extracting: 'Extracting information with AI…',
}

export default function UploadFlow({ onComplete, onCancel }) {
  const [status, setStatus] = useState('idle') // 'idle' | 'parsing' | 'extracting' | 'error'
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)
  const busy = status === 'parsing' || status === 'extracting'

  async function handleFile(file) {
    setError(null)
    setStatus('parsing')
    try {
      const text = await parseResumeFile(file)
      setStatus('extracting')
      const structuredData = await extractStructure(text)
      onComplete(structuredData)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Failed to process file. Please try again.')
    }
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (busy) return
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    if (!busy) setDragOver(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Upload your resume</h1>
        <p className="text-sm text-gray-500 mb-8">
          AI will extract your information automatically. You can review and edit everything before
          continuing.
        </p>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !busy && inputRef.current?.click()}
          className={[
            'border-2 border-dashed rounded-xl p-10 text-center transition-colors',
            busy
              ? 'border-blue-300 bg-blue-50 cursor-default'
              : dragOver
                ? 'border-blue-400 bg-blue-50 cursor-pointer'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 cursor-pointer',
          ].join(' ')}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            onChange={handleInputChange}
            className="hidden"
            disabled={busy}
          />

          {busy ? (
            <div className="flex flex-col items-center gap-3">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm font-medium text-blue-700">{STATUS_LABEL[status]}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <svg
                className="h-10 w-10 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.344 11.095H6.75z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-700">
                  Drop your resume here, or{' '}
                  <span className="text-blue-600">click to browse</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">PDF or Word (.docx)</p>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {status === 'error' && error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <p className="font-medium mb-1">Something went wrong</p>
            <p>{error}</p>
            <button
              onClick={() => { setStatus('idle'); setError(null) }}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
