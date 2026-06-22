export async function generateResumeContent(resumeData) {
  if (!resumeData.data.workExperience.length) {
    throw new Error('Please add at least one work experience entry before generating.')
  }

  const hasContent = resumeData.data.workExperience.some(
    e => e.company || e.title || e.bullets.some(b => b.trim())
  )
  if (!hasContent) {
    throw new Error('Please fill in some work experience details before generating.')
  }

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'AI generation failed. Please try again.')
  }

  const parsed = await res.json()

  if (!parsed.workExperience || !Array.isArray(parsed.workExperience)) {
    throw new Error('AI response missing workExperience. Please try again.')
  }

  // Merge enhanced bullets back into original entries, restoring _id fields
  const merged = resumeData.data.workExperience.map((orig, i) => {
    const enhanced = parsed.workExperience[i]
    if (!enhanced) return orig
    return { ...orig, bullets: enhanced.bullets ?? orig.bullets }
  })

  return {
    ...resumeData,
    data: { ...resumeData.data, workExperience: merged },
  }
}
