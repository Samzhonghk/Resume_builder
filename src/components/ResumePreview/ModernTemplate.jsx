const EMPTY_MSG = (
  <div
    className="bg-white flex items-center justify-center px-8 py-16 text-center"
    style={{ fontFamily: 'Arial, Helvetica, sans-serif', minHeight: '240px' }}
  >
    <p className="text-sm text-gray-400">Fill in the form on the left to see your resume preview here.</p>
  </div>
)

function SectionHeader({ title }) {
  return (
    <div className="mb-3">
      <h2 className="font-bold uppercase text-blue-700" style={{ fontSize: '9px', letterSpacing: '0.13em' }}>
        {title}
      </h2>
      <div className="border-b border-blue-600 mt-0.5" />
    </div>
  )
}

export default function ModernTemplate({ data }) {
  const { name, contact, workExperience, education, skills } = data.data
  const contactParts = [contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean)
  const hasContent = name || contactParts.length || workExperience.length || education.length || skills.length
  if (!hasContent) return EMPTY_MSG

  return (
    <div className="bg-white px-8 py-8 text-gray-900" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <header className="mb-4">
        <h1 className="font-bold leading-tight text-gray-900" style={{ fontSize: '22px' }}>
          {name || <span className="text-gray-300">Your Name</span>}
        </h1>
        {contactParts.length > 0 && (
          <p className="mt-1 text-gray-500" style={{ fontSize: '11px' }}>{contactParts.join(' · ')}</p>
        )}
      </header>

      {workExperience.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Work Experience" />
          <div className="space-y-4">
            {workExperience.map(entry => {
              const filledBullets = entry.bullets.filter(b => b.trim())
              return (
                <div key={entry._id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-gray-900 leading-snug" style={{ fontSize: '12px' }}>
                      {entry.company || <span className="text-gray-300">Company Name</span>}
                    </span>
                    {entry.period && (
                      <span className="text-gray-400 whitespace-nowrap flex-shrink-0" style={{ fontSize: '11px' }}>
                        {entry.period}
                      </span>
                    )}
                  </div>
                  {entry.title && (
                    <div className="italic leading-snug text-blue-600" style={{ fontSize: '11px' }}>
                      {entry.title}
                    </div>
                  )}
                  {filledBullets.length > 0 && (
                    <ul className="mt-1.5 space-y-1">
                      {filledBullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2 text-gray-800 leading-relaxed" style={{ fontSize: '11px' }}>
                          <span className="flex-shrink-0 select-none mt-px">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Education" />
          <div className="space-y-3">
            {education.map(entry => (
              <div key={entry._id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-gray-900 leading-snug" style={{ fontSize: '12px' }}>
                    {entry.institution || <span className="text-gray-300">Institution</span>}
                  </span>
                  {entry.period && (
                    <span className="text-gray-400 whitespace-nowrap flex-shrink-0" style={{ fontSize: '11px' }}>
                      {entry.period}
                    </span>
                  )}
                </div>
                {entry.degree && <div className="text-gray-500 leading-snug" style={{ fontSize: '11px' }}>{entry.degree}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <SectionHeader title="Skills" />
          <p className="text-gray-800 leading-relaxed" style={{ fontSize: '11px' }}>{skills.join(' · ')}</p>
        </section>
      )}
    </div>
  )
}
