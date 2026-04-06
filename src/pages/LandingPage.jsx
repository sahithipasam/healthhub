import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Personalized Care',
    text: 'Access support programs matched to your goals, energy levels, and daily student routine.',
  },
  {
    title: 'Expert Support',
    text: 'Connect with trained counselors and wellness mentors who understand campus life.',
  },
  {
    title: 'Safe and Confidential',
    text: 'Your privacy comes first with secure communication and protected wellness records.',
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-cyan-50 to-emerald-100 text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-[-8rem] mx-auto h-72 w-72 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-3rem] h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />

      <header className="relative border-b border-sky-200/70 bg-sky-50/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-black tracking-tight">Health Hub</h1>
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-sky-100"
            >
              Home
            </Link>
            <Link
              to="/signin"
              className="rounded-full border border-cyan-700 bg-cyan-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-800"
            >
              Log In
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 py-10">
        <section className="grid items-center gap-6 rounded-3xl border border-sky-200/80 bg-white/80 p-8 shadow-xl shadow-cyan-200/40 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Student Wellness Platform
            </p>
            <h2 className="max-w-xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Better Health,
              <span className="block text-cyan-700">Made Simpler</span>
            </h2>
            <p className="max-w-xl text-base text-slate-900/80 sm:text-lg">
              One calm space for counseling, events, and daily wellness support.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/signin"
                className="inline-flex rounded-xl border border-cyan-700 bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-800"
              >
                Get Started
              </Link>
              <Link
                to="/signin"
                className="inline-flex rounded-xl border border-sky-300 bg-white px-5 py-3 font-semibold text-cyan-800 transition hover:bg-sky-100"
              >
                Explore Programs
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Today at a glance</p>
            <div className="mt-3 space-y-3">
              <article className="rounded-xl border border-sky-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">Counselor Availability</p>
                <p className="text-sm text-slate-900/75">12 open slots across this week</p>
              </article>
              <article className="rounded-xl border border-sky-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">Upcoming Workshop</p>
                <p className="text-sm text-slate-900/75">Mindful Breathing at 5:30 PM</p>
              </article>
              <article className="rounded-xl border border-sky-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">Student Wellness Score</p>
                <p className="text-sm text-slate-900/75">Campus average is improving this month</p>
              </article>
            </div>
          </div>
        </section>

        <section id="about" className="mt-8">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Why choose us</p>
            <h3 className="mt-2 text-3xl font-black">Built for student well-being</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-sky-200 bg-white p-5 shadow-md shadow-sky-200/30 transition hover:-translate-y-1"
              >
                <h4 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-900/80">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="support"
          className="mt-8 rounded-3xl border border-emerald-200 bg-gradient-to-r from-cyan-700 to-emerald-600 p-7 text-white shadow-lg shadow-cyan-300/30"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-50/90">Ready to begin</p>
          <h3 className="mt-2 text-3xl font-black">Start your wellness journey with Health Hub</h3>
          <p className="mt-3 max-w-2xl text-cyan-50/90">
            Join students who are taking control of stress, sleep, and overall health with trusted campus support.
          </p>
          <Link
            to="/signin"
            className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-cyan-800 transition hover:-translate-y-0.5"
          >
            Continue to Sign In
          </Link>
        </section>

        <footer id="resources" className="mt-8 grid gap-4 rounded-3xl border border-sky-200 bg-white/85 p-6 text-sm text-slate-900/85 md:grid-cols-2">
          <div>
            <p className="font-black text-slate-900">Health Hub</p>
            <p className="mt-2">Supporting student health and well-being across campus.</p>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-[0.16em] text-cyan-700">Emergency</p>
            <p className="mt-2">If you are in crisis, call 988 immediately.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
