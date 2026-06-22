import { createElement } from 'react'

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadAsTxt(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, `${filename}.txt`)
}

export async function downloadAsPDF(text, filename) {
  const [{ pdf }, { default: CoverLetterPDF }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('../components/ResumePreview/CoverLetterPDF'),
  ])
  const blob = await pdf(createElement(CoverLetterPDF, { text })).toBlob()
  triggerDownload(blob, `${filename}.pdf`)
}

export function downloadAsRtf(text, filename) {
  const body = text
    .split('\n')
    .map(line => {
      const escaped = line
        .replace(/\\/g, '\\\\')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/[^\x00-\x7F]/g, c => `\\u${c.charCodeAt(0)}?`)
      return `${escaped}\\par\r\n`
    })
    .join('')

  const rtf =
    '{\\rtf1\\ansi\\ansicpg1252\\deff0\r\n' +
    '{\\fonttbl{\\f0\\fswiss\\fcharset0 Calibri;}}\r\n' +
    '\\f0\\fs22\\margl1440\\margr1440\\margt1440\\margb1440\r\n' +
    body +
    '}'

  const blob = new Blob([rtf], { type: 'application/rtf' })
  triggerDownload(blob, `${filename}.rtf`)
}
