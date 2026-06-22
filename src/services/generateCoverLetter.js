export async function generateCoverLetter(resumeData, jobDescription, jobTitle = '', company = '') {
  const res = await fetch('/api/cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData, jobDescription, jobTitle, company }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Cover letter generation failed. Please try again.')
  }

  const data = await res.json()
  if (!data.text) throw new Error('No response from AI. Please try again.')
  return data.text
}
