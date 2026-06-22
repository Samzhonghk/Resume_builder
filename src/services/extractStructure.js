import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an expert resume parser specialising in the New Zealand job market.

Extract structured information from resume text and return ONLY valid JSON with no markdown fences.

Rules:
1. Extract ALL work experience entries found in the text
2. Split responsibilities and achievements into individual bullet strings
3. Preserve original date formats (e.g. "Jan 2022 – Present", "2019–2021")
4. For contact: extract email, NZ phone (+64...), city/region, LinkedIn URL — empty string if not found
5. Skills: flat array of individual skill strings (not categories)
6. Return empty arrays [] for sections not present in the resume
7. Return ONLY the JSON object — no explanation, no code fences

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

export async function extractStructure(rawText) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'API key not configured. Create a .env file with VITE_ANTHROPIC_API_KEY=your_key (see .env.example).',
    )
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

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
  if (!textBlock) throw new Error('No response from AI. Please try again.')

  let parsed
  try {
    parsed = JSON.parse(textBlock.text.trim())
  } catch {
    throw new Error('AI returned an unexpected format. Please try again.')
  }

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
