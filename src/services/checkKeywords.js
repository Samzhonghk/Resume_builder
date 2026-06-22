import Anthropic from '@anthropic-ai/sdk'

function resumeText(resumeData) {
  const { workExperience, skills } = resumeData.data
  const parts = []
  if (skills.length) parts.push(skills.join(', '))
  workExperience.forEach(e => {
    if (e.title) parts.push(e.title)
    e.bullets.filter(b => b.trim()).forEach(b => parts.push(b))
  })
  return parts.join(' ')
}

export async function checkKeywords(resumeData, jobDescription) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'API key not configured. Create a .env file with VITE_ANTHROPIC_API_KEY=your_key.',
    )
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 512,
    system: `You are an ATS (Applicant Tracking System) expert.

Identify keywords and skills from the job description that are absent or insufficiently represented in the candidate's resume.

Rules:
1. Focus on: technical skills, tools, certifications, methodologies, role-specific terminology
2. Exclude generic soft skills (e.g. "communication", "teamwork") unless they are specific to the JD
3. Limit to the 10 most important gaps
4. Return ONLY a JSON array of strings — no explanation, no code fences
Example: ["Python", "Agile/Scrum", "Power BI", "JIRA", "Stakeholder management"]`,
    messages: [
      {
        role: 'user',
        content: `Candidate resume text:\n${resumeText(resumeData)}\n\nJob description:\n${jobDescription}`,
      },
    ],
  })

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock) throw new Error('No response from AI. Please try again.')

  try {
    const parsed = JSON.parse(textBlock.text.trim())
    if (!Array.isArray(parsed)) throw new Error()
    return parsed.filter(k => typeof k === 'string' && k.trim())
  } catch {
    throw new Error('AI returned an unexpected format. Please try again.')
  }
}
