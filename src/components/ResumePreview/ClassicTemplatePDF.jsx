import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const s = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.4,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 3,
  },
  contact: {
    fontSize: 9,
    color: '#4B5563',
    letterSpacing: 0.2,
  },
  section: { marginTop: 12 },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: '#374151',
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#D1D5DB',
    marginBottom: 5,
  },
  entryGap: { marginTop: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  company: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  institution: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  period: { fontSize: 9, color: '#6B7280' },
  jobTitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 3,
  },
  degree: { fontSize: 9, color: '#4B5563' },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { fontSize: 9, width: 9 },
  bulletText: { fontSize: 9, flex: 1, color: '#1F2937' },
  skills: { fontSize: 9, color: '#1F2937', lineHeight: 1.5 },
})

export default function ClassicTemplatePDF({ data }) {
  const { name, contact, workExperience, education, skills } = data.data

  const contactParts = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
  ].filter(Boolean)

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.name}>{name || 'Your Name'}</Text>
        {contactParts.length > 0 && (
          <Text style={s.contact}>{contactParts.join('  ·  ')}</Text>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Work Experience</Text>
            <View style={s.divider} />
            {workExperience.map((entry, i) => {
              const filledBullets = entry.bullets.filter(b => b.trim())
              return (
                <View key={entry._id ?? i} style={i > 0 ? s.entryGap : null}>
                  <View style={s.row}>
                    <Text style={s.company}>{entry.company}</Text>
                    {entry.period ? (
                      <Text style={s.period}>{entry.period}</Text>
                    ) : null}
                  </View>
                  {entry.title ? (
                    <Text style={s.jobTitle}>{entry.title}</Text>
                  ) : null}
                  {filledBullets.map((bullet, j) => (
                    <View key={j} style={s.bulletRow}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              )
            })}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            <View style={s.divider} />
            {education.map((entry, i) => (
              <View key={entry._id ?? i} style={i > 0 ? s.entryGap : null}>
                <View style={s.row}>
                  <Text style={s.institution}>{entry.institution}</Text>
                  {entry.period ? (
                    <Text style={s.period}>{entry.period}</Text>
                  ) : null}
                </View>
                {entry.degree ? (
                  <Text style={s.degree}>{entry.degree}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <View style={s.divider} />
            <Text style={s.skills}>{skills.join('  ·  ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
