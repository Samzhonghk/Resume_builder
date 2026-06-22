export async function checkKeywords(resumeData, jobDescription) {
  const res = await fetch('/api/keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData, jobDescription }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Keyword check failed. Please try again.')
  }

  const data = await res.json()
  if (!Array.isArray(data.keywords)) throw new Error('AI returned an unexpected format. Please try again.')
  return data.keywords
}
