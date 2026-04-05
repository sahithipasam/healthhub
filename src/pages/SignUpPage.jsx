import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function SignUpPage() {
  const { auth, registerUser } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' })
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
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!form.username.trim()) {
      setError('Username is required.')
      return
    }

    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const result = registerUser({
      role: 'student',
      username: form.username.trim(),
      password: form.password,
    })

    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate('/signin', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-emerald-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-3xl border border-sky-200 bg-white p-6 shadow-xl shadow-sky-200/40"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Sign Up</h2>
          <p className="text-sm text-slate-900/70">Create your student Health Hub account to continue.</p>
        </div>

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

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
        />

        {error && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800"
        >
          Create Account
        </button>

        <p className="text-sm text-slate-900/80">
          Already have an account? <Link to="/signin" className="font-semibold text-cyan-800 underline">Sign In</Link>
        </p>
      </form>
    </div>
  )
}
