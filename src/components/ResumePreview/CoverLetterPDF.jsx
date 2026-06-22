import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer'

const s = StyleSheet.create({
  page: {
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 72,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#111827',
    lineHeight: 1.6,
  },
  line: { marginBottom: 0 },
  blank: { marginBottom: 8 },
})

export default function CoverLetterPDF({ text }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {text.split('\n').map((line, i) => (
          <Text key={i} style={line === '' ? s.blank : s.line}>
            {line || ' '}
          </Text>
        ))}
      </Page>
    </Document>
  )
}
