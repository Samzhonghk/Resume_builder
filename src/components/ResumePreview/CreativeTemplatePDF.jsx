import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const s = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 42,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.4,
  },
  headerBlock: {
    backgroundColor: '#1E293B',
    paddingTop: 32,
    paddingBottom: 22,
    paddingHorizontal: 48,
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  body: {
    paddingHorizontal: 48,
  },
  section: { marginTop: 14 },
  sectionTitleWrap: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: '#1E293B',
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
    color: '#475569',
    marginBottom: 3,
  },
  degree: { fontSize: 9, color: '#4B5563' },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { fontSize: 9, width: 11, color: '#64748B' },
  bulletText: { fontSize: 9, flex: 1, color: '#1F2937' },
  skills: { fontSize: 9, color: '#1F2937', lineHeight: 1.5 },
})

export default function CreativeTemplatePDF({ data }) {
  const { name, contact, workExperience, education, skills } = data.data
  const contactParts = [contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean)

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Dark header */}
        <View style={s.headerBlock}>
          <Text style={s.name}>{name || 'Your Name'}</Text>
          {contactParts.length > 0 && <Text style={s.contact}>{contactParts.join('  ·  ')}</Text>}
        </View>

        <View style={s.body}>
          {workExperience.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionTitleWrap}>
                <Text style={s.sectionTitle}>Work Experience</Text>
              </View>
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
                        <Text style={s.bulletDot}>›</Text>
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
              <View style={s.sectionTitleWrap}>
                <Text style={s.sectionTitle}>Education</Text>
              </View>
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
              <View style={s.sectionTitleWrap}>
                <Text style={s.sectionTitle}>Skills</Text>
              </View>
              <Text style={s.skills}>{skills.join('  ·  ')}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
