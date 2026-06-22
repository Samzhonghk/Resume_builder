import { createEducationEntry } from '../../types/resume'

const inp = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function Education({ entries, onChange }) {
  function add() {
    onChange([...entries, createEducationEntry()])
  }

  function remove(id) {
    onChange(entries.filter(e => e._id !== id))
  }

  function update(id, field, value) {
    onChange(entries.map(e => (e._id === id ? { ...e, [field]: value } : e)))
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Entry {index + 1}</span>
            <button
              onClick={() => remove(entry._id)}
              className="text-sm text-red-400 hover:text-red-600"
            >
              Remove
            </button>
          </div>

          <Field label="Institution">
            <input
              className={inp}
              value={entry.institution}
              onChange={e => update(entry._id, 'institution', e.target.value)}
              placeholder="e.g. University of Auckland"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Degree / Qualification">
              <input
                className={inp}
                value={entry.degree}
                onChange={e => update(entry._id, 'degree', e.target.value)}
                placeholder="e.g. Bachelor of Commerce"
              />
            </Field>
            <Field label="Period">
              <input
                className={inp}
                value={entry.period}
                onChange={e => update(entry._id, 'period', e.target.value)}
                placeholder="e.g. 2018 – 2022"
              />
            </Field>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Education
      </button>
    </div>
  )
}
