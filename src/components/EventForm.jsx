import { useEffect, useState } from 'react'

const emptyForm = {
  title: '',
  date: '',
  time: '',
  venue: '',
  seats: '',
}

export default function EventForm({ onSubmit, editingEvent, onCancelEdit }) {
  const [form, setForm] = useState(editingEvent || emptyForm)

  useEffect(() => {
    setForm(editingEvent || emptyForm)
  }, [editingEvent])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title || !form.date || !form.time || !form.venue || Number(form.seats) < 0) {
      return
    }

    onSubmit({ ...form, seats: Number(form.seats) })
    if (!editingEvent) {
      setForm(emptyForm)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl border border-sky-200 bg-white p-4">
      <h3 className="text-lg font-bold text-slate-900">{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />
        <input
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="Time (e.g. 04:00 PM)"
          className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />
      </div>
      <input
        name="venue"
        value={form.venue}
        onChange={handleChange}
        placeholder="Venue"
        className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
      />
      <input
        type="number"
        min="0"
        name="seats"
        value={form.seats}
        onChange={handleChange}
        placeholder="Seats"
        className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
      />
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white hover:bg-cyan-800">
          {editingEvent ? 'Save Changes' : 'Add Event'}
        </button>
        {editingEvent && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-sky-300 px-4 py-2 font-semibold text-cyan-800 hover:bg-sky-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
