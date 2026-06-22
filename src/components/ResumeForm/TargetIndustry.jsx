import { useState, useEffect } from 'react'
import { INDUSTRIES } from '../../types/resume'

const inp = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

function getPreset(value) {
  if (!value) return ''
  const match = INDUSTRIES.find(i => i.label === value && i.value !== 'other')
  return match ? match.value : 'other'
}

export default function TargetIndustry({ value, onChange }) {
  const [preset, setPreset] = useState(() => getPreset(value))
  const [customText, setCustomText] = useState(() => (getPreset(value) === 'other' ? value : ''))

  useEffect(() => {
    const p = getPreset(value)
    setPreset(p)
    if (p === 'other') setCustomText(value)
  }, [value])

  function handlePresetChange(e) {
    const p = e.target.value
    setPreset(p)
    if (p && p !== 'other') {
      onChange(INDUSTRIES.find(i => i.value === p).label)
    } else if (p === 'other') {
      onChange(customText)
    } else {
      onChange('')
    }
  }

  function handleCustomChange(e) {
    setCustomText(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className="space-y-3">
      <select value={preset} onChange={handlePresetChange} className={inp}>
        <option value="">Select target industry...</option>
        {INDUSTRIES.map(i => (
          <option key={i.value} value={i.value}>{i.label}</option>
        ))}
      </select>
      {preset === 'other' && (
        <input
          type="text"
          value={customText}
          onChange={handleCustomChange}
          placeholder="e.g. Hospitality, Real Estate, Construction..."
          className={inp}
        />
      )}
    </div>
  )
}
