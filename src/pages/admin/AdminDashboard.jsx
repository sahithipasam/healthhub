import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import EventForm from '../../components/EventForm'
import TopNav from '../../components/TopNav'
import { getAdminData } from '../../api/admin'
import { useApp } from '../../context/AppContext'

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'events', label: 'Manage Events' },
  { key: 'feedback', label: 'Review Feedback' },
  { key: 'sessions', label: 'Manage Sessions' },
]

function DashboardPanel() {
  const { metrics, addCounselor, counselors } = useApp()
  const [form, setForm] = useState({ name: '', specialization: '', availability: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.specialization.trim() || !form.availability.trim()) {
      return
    }

    addCounselor({
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      availability: form.availability.trim(),
    })

    setForm({ name: '', specialization: '', availability: '' })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Usage Metrics</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <article className="rounded-lg bg-sky-100 p-3"><p className="text-sm">Total Events</p><p className="text-xl font-black text-slate-900">{metrics.totalEvents}</p></article>
          <article className="rounded-lg bg-sky-100 p-3"><p className="text-sm">Open Seats</p><p className="text-xl font-black text-slate-900">{metrics.openSeats}</p></article>
          <article className="rounded-lg bg-sky-100 p-3"><p className="text-sm">Feedbacks</p><p className="text-xl font-black text-slate-900">{metrics.totalFeedbacks}</p></article>
          <article className="rounded-lg bg-sky-100 p-3"><p className="text-sm">Pending Sessions</p><p className="text-xl font-black text-slate-900">{metrics.pendingSessions}</p></article>
        </div>
      </section>

      <section className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Counselor Management</h2>
        <form onSubmit={handleSubmit} className="mt-3 grid gap-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
          />
          <input
            placeholder="Specialization"
            value={form.specialization}
            onChange={(event) => setForm((prev) => ({ ...prev, specialization: event.target.value }))}
            className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
          />
          <input
            placeholder="Availability"
            value={form.availability}
            onChange={(event) => setForm((prev) => ({ ...prev, availability: event.target.value }))}
            className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
          />
          <button type="submit" className="rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white hover:bg-cyan-800">
            Add Counselor
          </button>
        </form>

        <div className="mt-3 space-y-2">
          {counselors.map((counselor) => (
            <article key={counselor.id} className="rounded-lg border border-sky-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">{counselor.name}</p>
              <p className="text-slate-900/80">{counselor.specialization}</p>
              <p className="text-slate-900/70">{counselor.availability}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function EventsPanel() {
  const { events, addEvent, updateEvent, deleteEvent } = useApp()
  const [editingId, setEditingId] = useState(null)

  const editingEvent = useMemo(() => events.find((event) => event.id === editingId), [events, editingId])

  const handleSubmit = (payload) => {
    if (editingId) {
      updateEvent(editingId, payload)
      setEditingId(null)
      return
    }

    addEvent(payload)
  }

  return (
    <section className="space-y-4 rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
      <EventForm onSubmit={handleSubmit} editingEvent={editingEvent} onCancelEdit={() => setEditingId(null)} />
      <div className="space-y-2">
        {events.map((event) => (
          <article key={event.id} className="rounded-xl border border-sky-200 bg-sky-50 p-3">
            <p className="font-bold text-slate-900">{event.title}</p>
            <p className="text-sm text-slate-900/80">
              {event.date} | {event.time} | {event.venue}
            </p>
            <p className="text-sm font-semibold text-cyan-800">Seats: {event.seats}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setEditingId(event.id)}
                className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-sky-100"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteEvent(event.id)}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function FeedbackPanel() {
  const { feedbacks, replyToFeedback } = useApp()
  const [replyDrafts, setReplyDrafts] = useState({})
  const [savedById, setSavedById] = useState({})

  const handleSaveReply = (item) => {
    replyToFeedback(item.id, (replyDrafts[item.id] ?? item.reply).trim())
    setSavedById((prev) => ({ ...prev, [item.id]: true }))

    window.setTimeout(() => {
      setSavedById((prev) => ({ ...prev, [item.id]: false }))
    }, 1500)
  }

  return (
    <section className="space-y-3 rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
      {feedbacks.map((item) => (
        <article key={item.id} className="rounded-xl border border-sky-200 bg-sky-50 p-3">
          <p className="font-semibold text-slate-900">Student: {item.studentId}</p>
          <p className="text-sm text-slate-900/85">{item.message}</p>
          <p className="text-xs text-slate-900/60">{item.createdAt}</p>
          <textarea
            value={replyDrafts[item.id] ?? item.reply}
            onChange={(event) =>
              setReplyDrafts((prev) => ({
                ...prev,
                [item.id]: event.target.value,
              }))
            }
            placeholder="Reply to this feedback"
            className="mt-2 min-h-20 w-full rounded-lg border border-sky-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={() => handleSaveReply(item)}
            className="mt-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
          >
            {savedById[item.id] ? 'Saved' : 'Save Reply'}
          </button>
        </article>
      ))}
    </section>
  )
}

function SessionsPanel() {
  const { sessions, updateSession } = useApp()
  const [rejectionReasons, setRejectionReasons] = useState({})
  const [actionStatus, setActionStatus] = useState({})

  const handleApprove = (sessionId) => {
    updateSession(sessionId, 'approved', '')
    setActionStatus((prev) => ({ ...prev, [sessionId]: 'approved' }))
  }

  const handleReject = (sessionId) => {
    const reason = rejectionReasons[sessionId] ?? ''
    updateSession(sessionId, 'rejected', reason.trim())
    setActionStatus((prev) => ({ ...prev, [sessionId]: 'rejected' }))
  }

  return (
    <section className="space-y-3 rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
      {sessions.map((session) => {
        const isRejecting = actionStatus[session.id] === 'rejecting'
        const isApproved = actionStatus[session.id] === 'approved'
        const isRejected = actionStatus[session.id] === 'rejected'

        return (
          <article key={session.id} className="rounded-xl border border-sky-200 bg-sky-50 p-3">
            <p className="font-semibold text-slate-900">Student: {session.studentId}</p>
            <p className="text-sm text-slate-900/80">Date: {session.date}</p>
            <p className="text-sm text-slate-900/80">Concern: {session.concern}</p>
            
            {isApproved && (
              <p className="text-sm font-semibold uppercase text-emerald-600 mt-2">Approved</p>
            )}

            {isRejected && (
              <>
                <p className="text-sm font-semibold uppercase text-red-600 mt-2">Rejected</p>
                {rejectionReasons[session.id] && (
                  <p className="text-sm text-slate-700 mt-2">Reason: {rejectionReasons[session.id]}</p>
                )}
              </>
            )}

            {isRejecting && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={rejectionReasons[session.id] ?? ''}
                  onChange={(event) => setRejectionReasons((prev) => ({ ...prev, [session.id]: event.target.value }))}
                  placeholder="Write rejection reason"
                  className="w-full rounded-lg border border-sky-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 min-h-20"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleReject(session.id)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Confirm Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionStatus((prev) => ({ ...prev, [session.id]: undefined }))}
                    className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-sky-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!isApproved && !isRejected && !isRejecting && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleApprove(session.id)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setActionStatus((prev) => ({ ...prev, [session.id]: 'rejecting' }))}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}

export default function AdminDashboard() {
  const { auth, logout } = useApp()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  if (!auth.isAuthenticated || auth.role !== 'admin') {
    return <Navigate to="/signin" replace />
  }

  const activeTab = params.get('tab') || 'dashboard'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminData()
        console.log(res.data)
      } catch (err) {
        console.error(err.response?.data)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!tabs.find((tab) => tab.key === activeTab)) {
      setParams({ tab: 'dashboard' })
    }
  }, [activeTab, setParams])

  const links = tabs.map((tab) => ({
    to: `/admin?tab=${tab.key}`,
    label: tab.label,
  }))

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-emerald-100">
      <TopNav title="Admin Panel" links={links} onLogout={handleLogout} showLogo={false} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        {activeTab === 'dashboard' && <DashboardPanel />}
        {activeTab === 'events' && <EventsPanel />}
        {activeTab === 'feedback' && <FeedbackPanel />}
        {activeTab === 'sessions' && <SessionsPanel />}
      </main>
    </div>
  )
}
