const inp = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function BasicInfo({ name, contact, onChange }) {
  function update(field, value) {
    if (field === 'name') {
      onChange(value, contact)
    } else {
      onChange(name, { ...contact, [field]: value })
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Full Name">
        <input
          className={inp}
          value={name}
          onChange={e => update('name', e.target.value)}
          placeholder="e.g. Jane Smith"
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email">
          <input
            className={inp}
            type="email"
            value={contact.email}
            onChange={e => update('email', e.target.value)}
            placeholder="jane@example.com"
          />
        </Field>
        <Field label="Phone">
          <input
            className={inp}
            type="tel"
            value={contact.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="+64 21 xxx xxxx"
          />
        </Field>
        <Field label="Location">
          <input
            className={inp}
            value={contact.location}
            onChange={e => update('location', e.target.value)}
            placeholder="Auckland, NZ"
          />
        </Field>
        <Field label="LinkedIn (optional)">
          <input
            className={inp}
            type="url"
            value={contact.linkedin}
            onChange={e => update('linkedin', e.target.value)}
            placeholder="linkedin.com/in/janesmith"
          />
        </Field>
        <Field label="Website (optional)">
          <input
            className={inp}
            type="url"
            value={contact.website}
            onChange={e => update('website', e.target.value)}
            placeholder="github.com/janesmith"
          />
        </Field>
      </div>
    </div>
  )
}
