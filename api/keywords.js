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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { resumeData, jobDescription } = req.body ?? {}
  if (!resumeData || !jobDescription) {
    return res.status(400).json({ error: 'Missing resumeData or jobDescription' })
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
    if (!textBlock) return res.status(500).json({ error: 'No response from AI.' })

    const parsed = JSON.parse(textBlock.text.trim())
    if (!Array.isArray(parsed)) throw new Error('Not an array')

    res.status(200).json({ keywords: parsed.filter(k => typeof k === 'string' && k.trim()) })
  } catch (err) {
    console.error('[api/keywords]', err)
    res.status(500).json({ error: 'Keyword check failed. Please try again.' })
  }
}

export const config = { maxDuration: 60 }
