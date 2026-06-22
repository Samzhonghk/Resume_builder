import Anthropic from '@anthropic-ai/sdk'

const INDUSTRY_GUIDELINES = {
  'Software Engineering / IT / AI':
    'Emphasise: specific technologies and languages used, project scale and impact, performance improvements with metrics where available, system design decisions, and engineering team collaboration. Use technical action verbs: Architected, Implemented, Optimised, Deployed, Migrated.',
  'Data / Analytics':
    'Emphasise: dataset scale, analytical methods, tools (SQL, Python, Tableau, Power BI), business insights generated, and the measurable impact of analysis on decisions. Action verbs: Analysed, Modelled, Visualised, Automated, Delivered.',
  'Marketing / Sales':
    'Emphasise: campaign ROI and KPIs, audience reach and engagement metrics, digital channels (SEO, SEM, social media), brand initiatives, and revenue or lead generation impact. Action verbs: Launched, Grew, Drove, Exceeded, Managed.',
  'Healthcare / Nursing':
    'Emphasise: patient care quality and outcomes, clinical skills and NZ registration/certifications, compliance with NZ health regulations, multidisciplinary team collaboration, and patient safety. Action verbs: Delivered, Managed, Coordinated, Implemented, Monitored.',
  Education:
    'Emphasise: student outcomes and learning progress, curriculum development, inclusive teaching practices, assessment and feedback methods, and community or school engagement. Action verbs: Developed, Facilitated, Designed, Assessed, Mentored.',
  'Business / Finance':
    'Emphasise: financial results (revenue growth, cost savings, P&L), stakeholder and client management, process improvements, strategic initiatives, and risk management. Action verbs: Led, Managed, Delivered, Reduced, Improved.',
}

function buildSystemPrompt(targetIndustry) {
  const guideline = INDUSTRY_GUIDELINES[targetIndustry] ?? null
  const industrySection =
    targetIndustry && targetIndustry !== 'Other'
      ? `\nTarget industry: ${targetIndustry}${guideline ? `\nIndustry focus — ${guideline}` : ''}`
      : ''

  return `You are an expert resume writer specialising in the New Zealand job market.

Your task: transform a candidate's raw work experience notes into polished, ATS-friendly achievement statements.${industrySection}

Rules you MUST follow:
1. Use strong past-tense action verbs (Led, Developed, Implemented, Delivered, Managed, etc.)
2. Apply the STAR method (Situation → Task → Action → Result) where the raw notes provide enough context
3. Keep each bullet concise — 1 to 2 lines
4. Do NOT invent facts, numbers, or experiences the user has not mentioned — only improve the language
5. Preserve any specific metrics or numbers the user has already provided
6. Write without personal pronouns (no "I" or "my")
7. Follow NZ resume conventions: professional tone, no age/gender/photo references
8. Return ONLY valid JSON — no markdown fences, no explanation text, nothing else`
}

function buildUserMessage(data) {
  // Strip client-only _id fields before sending to AI
  const clean = data.workExperience.map(({ _id, ...rest }) => rest)

  return `Enhance these work experience bullet points and return them as JSON, in the same order as the input.

Input:
${JSON.stringify(clean, null, 2)}

Return exactly this JSON structure:
{
  "workExperience": [
    {
      "company": "...",
      "title": "...",
      "period": "...",
      "bullets": ["enhanced bullet 1", "enhanced bullet 2"]
    }
  ]
}`
}

export async function generateResumeContent(resumeData) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'API key not configured. Create a .env file with VITE_ANTHROPIC_API_KEY=your_key (see .env.example).'
    )
  }

  if (!resumeData.data.workExperience.length) {
    throw new Error('Please add at least one work experience entry before generating.')
  }

  const hasContent = resumeData.data.workExperience.some(
    e => e.company || e.title || e.bullets.some(b => b.trim())
  )
  if (!hasContent) {
    throw new Error('Please fill in some work experience details before generating.')
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const stream = client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: buildSystemPrompt(resumeData.targetIndustry),
    messages: [{ role: 'user', content: buildUserMessage(resumeData.data) }],
  })

  const response = await stream.finalMessage()

  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock) throw new Error('No response from AI. Please try again.')

  let parsed
  try {
    parsed = JSON.parse(textBlock.text.trim())
  } catch {
    throw new Error('AI returned an unexpected format. Please try again.')
  }

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
