import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const createCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let text = ''

  for (let i = 0; i < 5; i += 1) {
    text += chars[Math.floor(Math.random() * chars.length)]
  }

  return { question: text, answer: text.toLowerCase() }
}

export default function SignInPage() {
  const { auth, login, authenticateUser, requestAdminOtp, verifyAdminOtp } = useApp()
  const navigate = useNavigate()
  const initialCaptcha = useMemo(() => createCaptcha(), [])
  const [captcha, setCaptcha] = useState(initialCaptcha)
  const [form, setForm] = useState({ role: 'student', username: '', password: '', adminOtp: '', captcha: '' })
  const [otpStep, setOtpStep] = useState(false)
  const [otpHint, setOtpHint] = useState('')
  const [error, setError] = useState('')

  if (auth.isAuthenticated && auth.role === 'student') {
    return <Navigate to="/student" replace />
  }

  if (auth.isAuthenticated && auth.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (name === 'role') {
      setOtpStep(false)
      setOtpHint('')
      setError('')
      setForm((prev) => ({ ...prev, adminOtp: '' }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!form.username.trim()) {
      setError('Username is required.')
      return
    }

    if (form.captcha.trim().toLowerCase() !== captcha.answer) {
      setError('Invalid CAPTCHA text.')
      setCaptcha(createCaptcha())
      setForm((prev) => ({ ...prev, captcha: '' }))
      return
    }

    if (form.role === 'admin' && otpStep) {
      const otpResult = verifyAdminOtp({ username: form.username, code: form.adminOtp })
      if (!otpResult.ok) {
        setError(otpResult.message)
        return
      }

      login(form.role, form.username.trim())
      navigate('/admin', { replace: true })
      return
    }

    const authResult = authenticateUser({
      role: form.role,
      username: form.username,
      password: form.password,
    })

    if (!authResult.ok) {
      setError(authResult.message)
      return
    }

    if (form.role === 'admin' && authResult.requiresOtp) {
      const otpResponse = requestAdminOtp(form.username)
      if (!otpResponse.ok) {
        setError(otpResponse.message)
        return
      }

      setOtpStep(true)
      setOtpHint(`OTP sent to ${authResult.adminContact}. Demo code: ${otpResponse.code}`)
      return
    }

    login(form.role, form.username.trim())
    navigate(form.role === 'admin' ? '/admin' : '/student', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-emerald-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-3xl border border-sky-200 bg-white p-6 shadow-xl shadow-sky-200/40"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Sign In</h2>
          <p className="text-sm text-slate-900/70">Enter your username and role to access Health Hub.</p>
        </div>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
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

        {form.role === 'admin' && otpStep && (
          <input
            type="password"
            name="adminOtp"
            value={form.adminOtp}
            onChange={handleChange}
            placeholder="Enter one-time OTP"
            className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
          />
        )}

        {form.role === 'admin' && otpStep && otpHint && (
          <p className="rounded-lg bg-sky-100 px-3 py-2 text-sm text-cyan-800">{otpHint}</p>
        )}

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
          {form.role === 'admin' && otpStep ? 'Verify OTP' : 'Continue'}
        </button>

        {form.role === 'admin' && (
          <p className="text-sm text-slate-900/80">
            New admin? <Link to="/admin-signup" className="font-semibold text-cyan-800 underline">Create admin account</Link>
          </p>
        )}

        <p className="text-sm text-slate-900/80">
          First time here? <Link to="/signup" className="font-semibold text-cyan-800 underline">Create account</Link>
        </p>

        <p className="text-sm text-slate-900/80">
          Return to <Link to="/" className="font-semibold text-cyan-800 underline">Home</Link>
        </p>
      </form>
    </div>
  )
}
