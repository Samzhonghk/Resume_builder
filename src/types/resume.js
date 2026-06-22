export const INDUSTRIES = [
  { value: 'software', label: 'Software Engineering / IT / AI' },
  { value: 'data', label: 'Data / Analytics' },
  { value: 'marketing', label: 'Marketing / Sales' },
  { value: 'healthcare', label: 'Healthcare / Nursing' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business / Finance' },
  { value: 'other', label: 'Other' },
]

export function createEmptyResume() {
  return {
    source: 'blank',
    targetIndustry: '',
    data: {
      name: '',
      contact: { email: '', phone: '', location: '', linkedin: '' },
      workExperience: [],
      education: [],
      skills: [],
    },
  }
}

// _id is a client-only stable key for React list rendering; strip before sending to AI
export function createWorkEntry() {
  return { _id: crypto.randomUUID(), company: '', title: '', period: '', bullets: [''] }
}

export function createEducationEntry() {
  return { _id: crypto.randomUUID(), institution: '', degree: '', period: '' }
}
