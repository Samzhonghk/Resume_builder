export async function extractStructure(rawText) {
  const res = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'AI extraction failed. Please try again.')
  }

  const parsed = await res.json()

  return {
    name: parsed.name || '',
    contact: {
      email: parsed.contact?.email || '',
      phone: parsed.contact?.phone || '',
      location: parsed.contact?.location || '',
      linkedin: parsed.contact?.linkedin || '',
    },
    workExperience: (parsed.workExperience || []).map(e => ({
      _id: crypto.randomUUID(),
      company: e.company || '',
      title: e.title || '',
      period: e.period || '',
      bullets: Array.isArray(e.bullets) && e.bullets.length > 0 ? e.bullets : [''],
    })),
    education: (parsed.education || []).map(e => ({
      _id: crypto.randomUUID(),
      institution: e.institution || '',
      degree: e.degree || '',
      period: e.period || '',
    })),
    skills: Array.isArray(parsed.skills) ? parsed.skills.filter(Boolean) : [],
  }
}
