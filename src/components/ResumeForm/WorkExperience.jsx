import { createWorkEntry } from '../../types/resume'

const inp = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function WorkExperience({ entries, onChange }) {
  function add() {
    onChange([...entries, createWorkEntry()])
  }

  function remove(id) {
    onChange(entries.filter(e => e._id !== id))
  }

  function update(id, field, value) {
    onChange(entries.map(e => (e._id === id ? { ...e, [field]: value } : e)))
  }

  function addBullet(id) {
    onChange(entries.map(e => (e._id === id ? { ...e, bullets: [...e.bullets, ''] } : e)))
  }

  function removeBullet(id, idx) {
    onChange(entries.map(e => (e._id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e)))
  }

  function updateBullet(id, idx, value) {
    onChange(
      entries.map(e =>
        e._id === id ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? value : b)) } : e
      )
    )
  }

  function move(index, direction) {
    const next = [...entries]
    const target = index + direction
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Position {index + 1}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed text-base leading-none px-1"
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => move(index, 1)}
                disabled={index === entries.length - 1}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed text-base leading-none px-1"
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => remove(entry._id)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Company">
              <input
                className={inp}
                value={entry.company}
                onChange={e => update(entry._id, 'company', e.target.value)}
                placeholder="e.g. Fonterra"
              />
            </Field>
            <Field label="Job Title">
              <input
                className={inp}
                value={entry.title}
                onChange={e => update(entry._id, 'title', e.target.value)}
                placeholder="e.g. Software Engineer"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Period">
              <input
                className={inp}
                value={entry.period}
                onChange={e => update(entry._id, 'period', e.target.value)}
                placeholder="e.g. Jan 2022 – Present"
              />
            </Field>
            <Field label="Location">
              <input
                className={inp}
                value={entry.location}
                onChange={e => update(entry._id, 'location', e.target.value)}
                placeholder="e.g. Auckland, NZ"
              />
            </Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Key Achievements / Responsibilities
            </label>
            <div className="space-y-2">
              {entry.bullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs shrink-0">•</span>
                  <input
                    className={inp}
                    value={bullet}
                    onChange={e => updateBullet(entry._id, bIdx, e.target.value)}
                    placeholder="e.g. Led migration to cloud that reduced costs by 30%"
                  />
                  {entry.bullets.length > 1 && (
                    <button
                      onClick={() => removeBullet(entry._id, bIdx)}
                      className="shrink-0 text-gray-400 hover:text-red-500 text-lg leading-none"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => addBullet(entry._id)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add bullet point
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Work Experience
      </button>
    </div>
  )
}
