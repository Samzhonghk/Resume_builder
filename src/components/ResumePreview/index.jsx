import ClassicTemplate from './ClassicTemplate'
import ModernTemplate from './ModernTemplate'
import MinimalTemplate from './MinimalTemplate'
import ProfessionalTemplate from './ProfessionalTemplate'
import CreativeTemplate from './CreativeTemplate'

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
}

export default function ResumePreview({ data, template = 'classic' }) {
  const Template = TEMPLATES[template] ?? ClassicTemplate
  return <Template data={data} />
}
