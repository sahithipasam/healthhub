import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { registerUser, requestOtp, resendOtp, verifyOtp } from '../api/auth'

const getApiErrorMessage = (err) => {
  const data = err.response?.data

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  const errors = Array.isArray(data?.errors)
    ? data.errors
        .map((item) => item?.message || item?.msg || item)
        .filter(Boolean)
        .join(', ')
    : ''

  return data?.message || data?.error || errors || err.message || 'Sign up failed.'
}

export default function AdminSignUpPage() {
  const { auth } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', otp: '' })
  const [error, setError] = useState('')
  const [otpRequested, setOtpRequested] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpMessage, setOtpMessage] = useState('')

  if (auth.isAuthenticated && auth.role === 'student') {
    return <Navigate to="/student" replace />
  }

  if (auth.isAuthenticated && auth.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'email') {
      setOtpRequested(false)
      setOtpVerified(false)
      setOtpMessage('')
      setForm((prev) => ({ ...prev, email: value, otp: '' }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleVerifyEmailClick = async () => {
    setError('')

    if (!form.email.trim()) {
      setError('Enter email before requesting OTP.')
      return
    }

    try {
      const res = await requestOtp(form.email.trim())
      setOtpRequested(true)
      setOtpVerified(false)
      setForm((prev) => ({ ...prev, otp: '' }))
      setOtpMessage(res.data || 'OTP sent. Please enter the 6-digit code.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  const handleVerifyOtpClick = async () => {
    setError('')

    if (!/^\d{6}$/.test(form.otp.trim())) {
      setError('Enter a valid 6-digit OTP.')
      return
    }

    try {
      const res = await verifyOtp(form.email.trim(), form.otp.trim())
      setOtpVerified(true)
      setOtpMessage(res.data || 'OTP verified successfully.')
    } catch (err) {
      setOtpVerified(false)
      setError(getApiErrorMessage(err))
    }
  }

  const handleResendOtpClick = async () => {
    setError('')

    if (!form.email.trim()) {
      setError('Enter email before requesting OTP.')
      return
    }

    try {
      const res = await resendOtp(form.email.trim())
      setOtpRequested(true)
      setOtpVerified(false)
      setForm((prev) => ({ ...prev, otp: '' }))
      setOtpMessage(res.data || 'OTP resent. Please check your inbox.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
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

    if (!otpRequested) {
      setError('Click Verify after entering email to request OTP.')
      return
    }

    if (!/^\d{6}$/.test(form.otp.trim())) {
      setError('Enter a valid 6-digit OTP.')
      return
    }

    if (!otpVerified) {
      setError('Please verify OTP before creating your account.')
      return
    }

    try {
      const normalizedName = form.name.trim()

      await registerUser({
        name: normalizedName,
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

        <div className="flex items-center gap-2">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleVerifyEmailClick}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Verify
          </button>
        </div>

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

        {otpRequested && (
          <div className="space-y-2">
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              inputMode="numeric"
              maxLength={6}
              className="w-full rounded-lg border border-sky-300 px-3 py-2 outline-none focus:border-cyan-500"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerifyOtpClick}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={handleResendOtpClick}
                className="rounded-lg border border-sky-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-sky-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {otpMessage && (
          <p className={`rounded-lg px-3 py-2 text-sm font-medium ${otpVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
            {otpMessage}
          </p>
        )}

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
