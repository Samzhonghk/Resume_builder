import { useState } from 'react'

const inp = 'border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

export default function Skills({ skills, onChange }) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim()
    if (!trimmed || skills.includes(trimmed)) return
    onChange([...skills, trimmed])
    setInput('')
  }

  function remove(idx) {
    onChange(skills.filter((_, i) => i !== idx))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className={inp + ' flex-1'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Project Management, Python, Communication..."
        />
        <button
          onClick={add}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-sm"
            >
              {skill}
              <button
                onClick={() => remove(idx)}
                className="text-blue-400 hover:text-blue-700 leading-none"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          Type a skill and press Enter or click Add.
        </p>
      )}
    </div>
  )
}
