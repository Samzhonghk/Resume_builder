import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const s = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 54,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.5,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 3,
  },
  contact: {
    fontSize: 9,
    color: '#9CA3AF',
    letterSpacing: 0.2,
  },
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  entryGap: { marginTop: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  company: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  institution: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  period: { fontSize: 9, color: '#9CA3AF' },
  jobTitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 3,
  },
  degree: { fontSize: 9, color: '#6B7280' },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { fontSize: 9, width: 9, color: '#9CA3AF' },
  bulletText: { fontSize: 9, flex: 1, color: '#374151' },
  skills: { fontSize: 9, color: '#374151', lineHeight: 1.5 },
})

export default function MinimalTemplatePDF({ data }) {
  const { name, contact, workExperience, education, skills } = data.data
  const contactParts = [contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean)

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{name || 'Your Name'}</Text>
        {contactParts.length > 0 && <Text style={s.contact}>{contactParts.join('   ')}</Text>}

        {workExperience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Experience</Text>
            {workExperience.map((entry, i) => {
              const filledBullets = entry.bullets.filter(b => b.trim())
              return (
                <View key={entry._id ?? i} style={i > 0 ? s.entryGap : null}>
                  <View style={s.row}>
                    <Text style={s.company}>{entry.company}</Text>
                    {entry.period ? <Text style={s.period}>{entry.period}</Text> : null}
                  </View>
                  {entry.title ? <Text style={s.jobTitle}>{entry.title}</Text> : null}
                  {filledBullets.map((bullet, j) => (
                    <View key={j} style={s.bulletRow}>
                      <Text style={s.bulletDot}>–</Text>
                      <Text style={s.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              )
            })}
          </View>
        )}

        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            {education.map((entry, i) => (
              <View key={entry._id ?? i} style={i > 0 ? s.entryGap : null}>
                <View style={s.row}>
                  <Text style={s.institution}>{entry.institution}</Text>
                  {entry.period ? <Text style={s.period}>{entry.period}</Text> : null}
                </View>
                {entry.degree ? <Text style={s.degree}>{entry.degree}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <Text style={s.skills}>{skills.join('   ·   ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
