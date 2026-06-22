export async function parsePDF(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).href

  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pageTexts = []
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i)
    const textContent = await page.getTextContent()
    const text = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ')
    pageTexts.push(text)
  }
  return pageTexts.join('\n\n')
}

export async function parseDOCX(file) {
  const { default: mammoth } = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export async function parseResumeFile(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) return parsePDF(file)
  if (name.endsWith('.docx')) return parseDOCX(file)
  if (name.endsWith('.doc')) {
    throw new Error(
      'Old .doc format is not supported in the browser. Please save your resume as .docx (Word 2007 or later) and try again.',
    )
  }
  throw new Error('Unsupported file type. Please upload a PDF or Word (.docx) file.')
}
