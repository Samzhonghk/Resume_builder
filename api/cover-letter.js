import Anthropic from '@anthropic-ai/sdk'

function buildCandidateSummary(resumeData) {
  const { name, contact, workExperience, education, skills } = resumeData.data
  const lines = []

  if (name) lines.push(`Candidate: ${name}`)
  if (contact.location) lines.push(`Location: ${contact.location}`)
  if (resumeData.targetIndustry) lines.push(`Target industry: ${resumeData.targetIndustry}`)
  if (skills.length) lines.push(`Skills: ${skills.join(', ')}`)

  if (workExperience.length) {
    lines.push('\nWork Experience:')
    workExperience.forEach(e => {
      lines.push(`- ${e.title || 'Role'} at ${e.company || 'Company'} (${e.period || ''})`)
      e.bullets.filter(b => b.trim()).forEach(b => lines.push(`  • ${b}`))
    })
  }

  if (education.length) {
    lines.push('\nEducation:')
    education.forEach(e => {
      lines.push(`- ${e.degree || ''} at ${e.institution || ''} (${e.period || ''})`)
    })
  }

  return lines.join('\n')
}

const SYSTEM_PROMPT = `You are an expert cover letter writer for the New Zealand job market.

Write a professional, tailored cover letter for the candidate based on their resume and the job description.

Requirements:
1. NZ professional format:
   - Opening: name the specific role and company (if provided), briefly introduce why you're a strong fit
   - Body (1–2 paragraphs): connect specific resume experiences to the JD requirements
   - Closing: express enthusiasm and invite further conversation
2. Warm and confident tone — not stiff or formulaic. Avoid "I am writing to..." clichés
3. Around 250–350 words
4. Reference concrete skills or achievements from the resume that match the JD
5. Do NOT invent facts not present in the resume
6. End with a closing line (e.g. "Kind regards,") followed by the candidate's name on a new line
7. Return ONLY the cover letter text, no subject line, no date, no address block`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { resumeData, jobDescription, jobTitle = '', company = '' } = req.body ?? {}
  if (!resumeData || !jobDescription) {
    return res.status(400).json({ error: 'Missing resumeData or jobDescription' })
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const signingName = resumeData.data.name?.trim() || 'Sam Zhong'

    const userContent = [
      `Candidate resume summary:\n${buildCandidateSummary(resumeData)}`,
      `Candidate's name for signing: ${signingName}`,
      jobTitle ? `Target role: ${jobTitle}` : '',
      company ? `Target company: ${company}` : '',
      `\nJob description:\n${jobDescription}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const textBlock = message.content.find(b => b.type === 'text')
    if (!textBlock) return res.status(500).json({ error: 'No response from AI.' })

    res.status(200).json({ text: textBlock.text.trim() })
  } catch (err) {
    console.error('[api/cover-letter]', err)
    res.status(500).json({ error: 'Cover letter generation failed. Please try again.' })
  }
}

export const config = { maxDuration: 60 }
