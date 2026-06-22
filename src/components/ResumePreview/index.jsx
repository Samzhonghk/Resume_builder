import ClassicTemplate from './ClassicTemplate'

const TEMPLATES = {
  classic: ClassicTemplate,
}

export default function ResumePreview({ data, template = 'classic' }) {
  const Template = TEMPLATES[template] ?? ClassicTemplate
  return <Template data={data} />
}
