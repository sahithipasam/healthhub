import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { registerUser } from '../api/auth'

export default function AdminSignUpPage() {
  const { auth } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }

    if (!form.email.trim()) {
      setError('Email is required.')
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

    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'ADMIN',
      })

      navigate('/signin', { replace: true })
    } catch (err) {
      if (err.message === 'Network Error') {
        setError('Cannot reach auth server. Check API URL/CORS or start backend on port 2026.')
        return
      }

      setError(err.response?.data?.message || err.message || 'Sign up failed.')
    }
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-emerald-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-3xl border border-sky-200 bg-white p-6 shadow-xl shadow-sky-200/40"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Admin Sign Up</h2>
          <p className="text-sm text-slate-900/70">Create a new admin account.</p>
        </div>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
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
          Create Admin Account
        </button>

        <p className="text-sm text-slate-900/80">
          Already have admin credentials? <Link to="/signin" className="font-semibold text-cyan-800 underline">Sign In</Link>
        </p>
      </form>
    </div>
  )
}
