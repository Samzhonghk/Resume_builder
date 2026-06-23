import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an expert resume parser specialising in the New Zealand job market.

Extract structured information from resume text and return ONLY valid JSON with no markdown fences.

Rules:
1. Extract ALL work experience entries found in the text
2. Also extract entries from any "Projects", "Personal Projects", "Key Projects", or similar sections — map each project into workExperience using the project name as "company" and "Project" as "title"
3. Split responsibilities and achievements into individual bullet strings
4. Preserve original date formats (e.g. "Jan 2022 – Present", "2019–2021")
5. For contact: extract email, NZ phone (+64...), city/region, LinkedIn URL — empty string if not found
6. Skills: flat array of individual skill strings (not categories)
7. Return empty arrays [] for sections not present in the resume
8. Return ONLY the JSON object — no explanation, no code fences

JSON structure to return:
{
  "name": "",
  "contact": { "email": "", "phone": "", "location": "", "linkedin": "" },
  "workExperience": [
    { "company": "", "title": "", "period": "", "bullets": [""] }
  ],
  "education": [{ "institution": "", "degree": "", "period": "" }],
  "skills": []
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { rawText } = req.body ?? {}
  if (!rawText) return res.status(400).json({ error: 'Missing rawText' })

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Extract structured resume data from the following text:\n\n${rawText}`,
        },
      ],
    })

    const textBlock = message.content.find(b => b.type === 'text')
    if (!textBlock) return res.status(500).json({ error: 'No response from AI.' })

    const parsed = JSON.parse(textBlock.text.trim())

    res.status(200).json({
      name: parsed.name || '',
      contact: {
        email: parsed.contact?.email || '',
        phone: parsed.contact?.phone || '',
        location: parsed.contact?.location || '',
        linkedin: parsed.contact?.linkedin || '',
      },
      workExperience: (parsed.workExperience || []).map(e => ({
        company: e.company || '',
        title: e.title || '',
        period: e.period || '',
        bullets: Array.isArray(e.bullets) && e.bullets.length > 0 ? e.bullets : [''],
      })),
      education: (parsed.education || []).map(e => ({
        institution: e.institution || '',
        degree: e.degree || '',
        period: e.period || '',
      })),
      skills: Array.isArray(parsed.skills) ? parsed.skills.filter(Boolean) : [],
    })
  } catch (err) {
    console.error('[api/extract]', err)
    res.status(500).json({ error: 'AI extraction failed. Please try again.' })
  }
}

export const config = { maxDuration: 60 }
