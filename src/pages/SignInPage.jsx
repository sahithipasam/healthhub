import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { loginUser } from '../api/auth'

const getApiErrorMessage = (err) => {
  const data = err.response?.data

  if (typeof data === 'string' && data.trim()) {
    if (data.trim().toLowerCase() === 'user not found') {
      return 'User not found. Sign in with the registered email address used during signup.'
    }

    return data
  }

  return data?.message || err.message || 'Incorrect email or password.'
}

const createCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let text = ''

  for (let i = 0; i < 5; i += 1) {
    text += chars[Math.floor(Math.random() * chars.length)]
  }

  return { question: text, answer: text.toLowerCase() }
}

export default function SignInPage() {
  const { auth, login } = useApp()
  const navigate = useNavigate()
  const initialCaptcha = useMemo(() => createCaptcha(), [])
  const [captcha, setCaptcha] = useState(initialCaptcha)
  const [form, setForm] = useState({ role: 'STUDENT', name: '', email: '', password: '', captcha: '' })
  const [error, setError] = useState('')

  if (auth.isAuthenticated && auth.role?.toLowerCase() === 'student') {
    return <Navigate to="/student" replace />
  }

  if (auth.isAuthenticated && auth.role?.toLowerCase() === 'admin') {
    return <Navigate to="/admin" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.email.trim()) {
      setError('Email is required.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    if (!form.password) {
      setError('Password is required.')
      return
    }

    if (form.captcha.trim().toLowerCase() !== captcha.answer) {
      setError('Invalid CAPTCHA text.')
      setCaptcha(createCaptcha())
      setForm((prev) => ({ ...prev, captcha: '' }))
      return
    }

    try {
      const credential = form.email.trim()
      const displayName = form.name.trim()
      const normalizedRole = form.role.toLowerCase()
      const res = await loginUser({
        email: credential,
        password: form.password,
      })

      const token = res.data?.token
      if (token) {
        localStorage.setItem('token', token)
      }

      login(normalizedRole, displayName || credential)
      navigate(normalizedRole === 'admin' ? '/admin' : '/student', { replace: true })
    } catch (err) {
      if (err.message === 'Network Error') {
        setError('Cannot reach auth server. Start frontend on http://localhost:5173 and backend on port 2026.')
        return
      }

      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-emerald-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-3xl border border-sky-200 bg-white p-6 shadow-xl shadow-sky-200/40"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Sign In</h2>
          <p className="text-sm text-slate-900/70">Enter your email and role to access Health Hub.</p>
        </div>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        >
          <option value="ADMIN">Admin</option>
          <option value="STUDENT">Student</option>
        </select>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />

        <label className="block text-sm font-semibold text-slate-900">CAPTCHA text: {captcha.question}</label>
        <input
          name="captcha"
          value={form.captcha}
          onChange={handleChange}
          placeholder="Type the CAPTCHA text"
          className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />

        {error && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800"
        >
          Continue
        </button>

        {form.role === 'ADMIN' && (
          <p className="text-sm text-slate-900/80">
            New admin? <Link to="/admin-signup" className="font-semibold text-cyan-800 underline">Create admin account</Link>
          </p>
        )}

        {form.role === 'STUDENT' && (
          <p className="text-sm text-slate-900/80">
            First time here? <Link to="/signup" className="font-semibold text-cyan-800 underline">Create account</Link>
          </p>
        )}

        <p className="text-sm text-slate-900/80">
          Return to <Link to="/" className="font-semibold text-cyan-800 underline">Home</Link>
        </p>
      </form>
    </div>
  )
}
