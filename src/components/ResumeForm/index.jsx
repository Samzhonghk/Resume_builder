import { useState } from 'react'
import BasicInfo from './BasicInfo'
import TargetIndustry from './TargetIndustry'
import WorkExperience from './WorkExperience'
import Education from './Education'
import Skills from './Skills'
import { generateResumeContent } from '../../services/aiGenerate'

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  )
}

export default function ResumeForm({ resumeData, onChange }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function updateData(partial) {
    onChange({ ...resumeData, data: { ...resumeData.data, ...partial } })
  }

  async function handleGenerate() {
    setIsGenerating(true)
    setError(null)
    setSuccess(false)
    try {
      const enhanced = await generateResumeContent(resumeData)
      onChange(enhanced)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <Section title="Personal Information">
        <BasicInfo
          name={resumeData.data.name}
          contact={resumeData.data.contact}
          onChange={(name, contact) => updateData({ name, contact })}
        />
      </Section>

      <Section title="Target Industry / Role">
        <TargetIndustry
          value={resumeData.targetIndustry}
          onChange={targetIndustry => onChange({ ...resumeData, targetIndustry })}
        />
      </Section>

      <Section title="Work Experience">
        <WorkExperience
          entries={resumeData.data.workExperience}
          onChange={workExperience => updateData({ workExperience })}
        />
      </Section>

      <Section title="Education">
        <Education
          entries={resumeData.data.education}
          onChange={education => updateData({ education })}
        />
      </Section>

      <Section title="Skills">
        <Skills
          skills={resumeData.data.skills}
          onChange={skills => updateData({ skills })}
        />
      </Section>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {resumeData.source === 'uploaded' ? 'Optimise with AI' : 'Generate with AI'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {resumeData.source === 'uploaded'
            ? 'AI refines your existing bullet points — improving language, applying the STAR method, and aligning with your target industry. No facts will be invented.'
            : 'AI rewrites your work experience bullet points using professional language and the STAR method. Your original content is preserved — only the wording improves. No facts will be invented.'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
            Done! Your bullet points have been enhanced. Review and edit them in the Work Experience section above.
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-4 w-4 flex-shrink-0"
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
              Generating with AI...
            </>
          ) : resumeData.source === 'uploaded' ? (
            'Optimise with AI'
          ) : (
            'Generate with AI'
          )}
        </button>
      </div>
    </div>
  )
}
