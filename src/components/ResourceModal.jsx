export default function ResourceModal({ resource, onClose }) {
  if (!resource) {
    return null
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/45 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-sky-50 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-slate-900">{resource.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-sky-200 px-3 py-1 text-sm font-semibold text-slate-900 hover:bg-sky-300"
          >
            Close
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-900/80">{resource.description}</p>

        <ul className="space-y-2 text-sm text-slate-900">
          {resource.points.map((point) => (
            <li key={point} className="rounded-lg border border-sky-200 bg-white px-3 py-2">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
