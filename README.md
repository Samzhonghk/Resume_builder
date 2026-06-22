# NZ Resume Builder

An AI-powered resume generation tool for New Zealand job seekers. Upload an existing resume or start from scratch — get polished, ATS-friendly results in minutes.

**Live site: https://resume-builder-iota-gules.vercel.app**

## Features

- Two creation paths: start from scratch or upload an existing PDF/Word resume
- AI-powered resume optimisation tailored to the NZ job market
- 5 resume templates (Classic, Modern, Minimal, Professional, Creative)
- Cover letter generation from job descriptions
- Keyword gap analysis against target JDs
- Export to PDF; cover letter export to PDF, RTF, or plain text

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (requires Vercel CLI)
npx vercel dev
```

Create a `.env` file with your Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
```

## Tech Stack

- React + Vite + Tailwind CSS
- Claude API (claude-opus-4-8) via Vercel Serverless Functions
- PDF parsing: pdfjs-dist + mammoth
- PDF export: @react-pdf/renderer
- Deployed on Vercel
