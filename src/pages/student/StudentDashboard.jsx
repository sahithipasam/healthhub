import { useMemo, useState } from 'react'
import ResourceModal from '../../components/ResourceModal'
import { useApp } from '../../context/AppContext'

const resources = [
  {
    id: 'study-planner',
    title: 'Study Planner',
    description: 'Plan learning blocks that protect sleep and reduce panic cycles.',
    points: ['Use 45-minute focus blocks', 'Break every 10 minutes', 'Stop studying 1 hour before sleep'],
  },
  {
    id: 'mindful-breathing',
    title: 'Mindful Breathing',
    description: 'Quick breathing exercises to reduce stress before classes or exams.',
    points: ['Inhale for 4 seconds', 'Hold for 4 seconds', 'Exhale for 6 seconds'],
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Hygiene',
    description: 'Build a sleep routine that supports memory, mood, and concentration.',
    points: ['Keep consistent bedtime', 'Avoid screens 30 minutes before sleep', 'Limit caffeine after 5 PM'],
  },
  {
    id: 'nutrition-basics',
    title: 'Nutrition Basics',
    description: 'Simple meal tips for stable energy during intense academic weeks.',
    points: ['Include protein in breakfast', 'Hydrate every 2-3 hours', 'Choose whole-food snacks'],
  },
]

function DashboardSection() {
  const [showRoutine, setShowRoutine] = useState(false)

  return (
    <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm lg:p-7">
      <h2 className="text-xl font-bold text-slate-900">Welcome to your wellness dashboard</h2>
      <p className="mt-3 text-sm text-slate-900/80">
        Track your well-being, attend workshops, and connect with counselors from one place.
      </p>
      <div className="mt-5 rounded-xl bg-sky-100 p-5">
        <h3 className="font-bold text-slate-900">Well-being Overview</h3>
        <p className="mt-2 text-sm text-slate-900/80">Balanced routine score: 82/100. Keep momentum this week.</p>
      </div>
      <button
        type="button"
        onClick={() => setShowRoutine((prev) => !prev)}
        className="mt-5 rounded-lg bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-800"
      >
        {showRoutine ? 'Hide Daily Routine' : 'View Daily Routine'}
      </button>

      {showRoutine && (
        <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-5">
          <h4 className="font-bold text-slate-900">Today’s Suggested Routine</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-900/80">
            <li>7:00 AM - Light stretch and hydration</li>
            <li>9:00 AM - Focus study block (45 mins)</li>
            <li>1:00 PM - Balanced lunch and short walk</li>
            <li>5:30 PM - Breathing or mindfulness session</li>
            <li>10:30 PM - Screen-off wind-down routine</li>
          </ul>
        </div>
      )}
    </section>
  )
}

function ResourcesSection() {
  const [activeResource, setActiveResource] = useState(null)

  return (
    <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm lg:p-7">
      <h2 className="text-xl font-bold text-slate-900">Resources</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {resources.map((resource) => (
          <button
            key={resource.id}
            type="button"
            onClick={() => setActiveResource(resource)}
            className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-left font-semibold text-slate-900 transition hover:bg-sky-100"
          >
            {resource.title}
          </button>
        ))}
      </div>
      <ResourceModal resource={activeResource} onClose={() => setActiveResource(null)} />
    </section>
  )
}

function EventsSection() {
  const { auth, events, eventRegistrations, registerForEvent } = useApp()
  const [message, setMessage] = useState('')

  const myRegisteredEventIds = useMemo(() => {
    const myId = (auth.username || '').trim()
    return new Set(
      eventRegistrations
        .filter((registration) => registration.studentId === myId)
        .map((registration) => registration.eventId),
    )
  }, [auth.username, eventRegistrations])

  const handleRegister = (id) => {
    const result = registerForEvent(id, auth.username)

    if (result.ok) {
      setMessage('Registration successful.')
      return
    }

    if (result.reason === 'already-registered') {
      setMessage('You are already registered for this event.')
      return
    }

    setMessage('No seats available for this event.')
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm lg:p-7">
      <h2 className="text-xl font-bold text-slate-900">Events & Workshops</h2>
      {message && <p className="mt-4 rounded-lg bg-sky-100 px-4 py-2.5 text-sm text-cyan-800">{message}</p>}
      <div className="mt-4 space-y-4">
        {events.map((event) => (
          (() => {
            const isRegistered = myRegisteredEventIds.has(event.id)
            return (
              <article key={event.id} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <h3 className="font-bold text-slate-900">{event.title}</h3>
                <p className="mt-1 text-sm text-slate-900/80">
                  {event.date} | {event.time} | {event.venue}
                </p>
                <p className="mt-2 text-sm font-semibold text-cyan-800">Available seats: {event.seats}</p>
                <button
                  type="button"
                  disabled={isRegistered || event.seats <= 0}
                  onClick={() => handleRegister(event.id)}
                  className={`mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${
                    isRegistered ? 'bg-emerald-600 disabled:bg-emerald-600' : 'bg-cyan-700 disabled:bg-sky-300'
                  }`}
                >
                  {isRegistered ? 'Registered' : 'Register'}
                </button>
              </article>
            )
          })()
        ))}
      </div>
    </section>
  )
}

function CounselorSection() {
  const { auth, counselors, sessions, bookSession } = useApp()
  const [form, setForm] = useState({ date: '', concern: '' })

  const mySessions = useMemo(
    () => sessions.filter((session) => session.studentId === auth.username),
    [sessions, auth.username],
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.date || !form.concern.trim()) {
      return
    }

    bookSession({ studentId: auth.username, date: form.date, concern: form.concern.trim() })
    setForm({ date: '', concern: '' })
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm lg:p-7">
      <h2 className="text-xl font-bold text-slate-900">Counselor Connect</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
        <input
          type="date"
          value={form.date}
          onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          className="rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />
        <textarea
          value={form.concern}
          onChange={(event) => setForm((prev) => ({ ...prev, concern: event.target.value }))}
          placeholder="Describe your concern"
          className="min-h-24 rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />
        <button type="submit" className="rounded-lg bg-cyan-700 px-5 py-2.5 font-semibold text-white hover:bg-cyan-800">
          Book Session
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold text-slate-900">Available Counselors</h3>
        <div className="mt-3 space-y-3">
          {counselors.map((counselor) => (
            <article key={counselor.id} className="rounded-lg border border-sky-200 p-4 text-sm">
              <p className="font-semibold text-slate-900">{counselor.name}</p>
              <p className="mt-1 text-slate-900/80">{counselor.specialization}</p>
              <p className="mt-1 text-slate-900/70">{counselor.availability}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-slate-900">My Session Requests</h3>
        <div className="mt-3 space-y-3">
          {mySessions.map((session) => (
            <article key={session.id} className="rounded-lg border border-sky-200 p-4 text-sm">
              <p className="font-semibold text-slate-900">{session.date}</p>
              <p className="mt-1 text-slate-900/80">{session.concern}</p>
              <p className="mt-2 font-semibold uppercase text-cyan-700">Status: {session.status}</p>
              {session.responseMessage && <p className="mt-2 text-slate-900/80">Admin: {session.responseMessage}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeedbackSection() {
  const { auth, feedbacks, submitFeedback } = useApp()
  const [message, setMessage] = useState('')

  const myFeedbacks = useMemo(
    () => feedbacks.filter((item) => item.studentId === auth.username),
    [feedbacks, auth.username],
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!message.trim()) {
      return
    }

    submitFeedback({ studentId: auth.username, message: message.trim() })
    setMessage('')
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm lg:p-7">
      <h2 className="text-xl font-bold text-slate-900">Feedback</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share your feedback"
          className="min-h-24 rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />
        <button type="submit" className="w-fit rounded-lg bg-cyan-700 px-5 py-2.5 font-semibold text-white hover:bg-cyan-800">
          Submit Feedback
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {myFeedbacks.map((item) => (
          <article key={item.id} className="rounded-lg border border-sky-200 p-4 text-sm">
            <p className="text-slate-900">{item.message}</p>
            <p className="mt-2 text-xs text-slate-900/60">Submitted on {item.createdAt}</p>
            <p className="mt-3 font-semibold text-cyan-800">Admin reply:</p>
            <p className="mt-1 text-slate-900/80">{item.reply || 'No response yet.'}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function StudentDashboard({ section }) {
  if (section === 'events') return <EventsSection />
  if (section === 'counselor') return <CounselorSection />
  if (section === 'feedback') return <FeedbackSection />

  return (
    <div className="space-y-6">
      <DashboardSection />
      <ResourcesSection />
    </div>
  )
}
