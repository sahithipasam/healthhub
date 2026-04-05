import { createContext, useContext, useMemo, useState } from 'react'
import {
  createId,
  initialCounselors,
  initialEvents,
  initialFeedbacks,
  initialSessions,
} from '../data/mockData'

const AppContext = createContext(null)
const USERS_STORAGE_KEY = 'health-hub-users'

const readStoredUsers = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeStoredUsers = (users) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function AppProvider({ children }) {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: null, username: '' })
  const [users, setUsers] = useState(() => readStoredUsers())
  const [adminOtpChallenges, setAdminOtpChallenges] = useState([])
  const [events, setEvents] = useState(initialEvents)
  const [eventRegistrations, setEventRegistrations] = useState([])
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks)
  const [sessions, setSessions] = useState(initialSessions)
  const [counselors, setCounselors] = useState(initialCounselors)

  const login = (role, username) => {
    setAuth({ isAuthenticated: true, role, username })
  }

  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, username: '' })
  }

  const registerUser = ({ role, username, password, adminContact }) => {
    const normalizedUsername = username.trim().toLowerCase()
    if (!normalizedUsername || !password) {
      return { ok: false, message: 'Username and password are required.' }
    }

    if (role === 'admin') {
      if (!(adminContact || '').trim()) {
        return { ok: false, message: 'Admin email or contact is required.' }
      }
    }

    const duplicate = users.some(
      (user) => user.role === role && user.username.toLowerCase() === normalizedUsername,
    )

    if (duplicate) {
      return { ok: false, message: 'An account already exists for this role and username.' }
    }

    const nextUsers = [
      ...users,
      {
        id: createId(),
        role,
        username: username.trim(),
        password,
        ...(role === 'admin' ? { adminContact: adminContact.trim() } : {}),
      },
    ]
    setUsers(nextUsers)
    writeStoredUsers(nextUsers)
    return { ok: true }
  }

  const authenticateUser = ({ role, username, password }) => {
    const normalizedUsername = username.trim().toLowerCase()

    const matchedUser = users.find(
      (user) =>
        user.role === role && user.username.toLowerCase() === normalizedUsername && user.password === password,
    )

    if (matchedUser) {
      return {
        ok: true,
        requiresOtp: role === 'admin',
        adminContact: role === 'admin' ? matchedUser.adminContact : null,
      }
    }

    return { ok: false, message: 'Incorrect username or password. Please sign up first.' }
  }

  const requestAdminOtp = (username) => {
    const normalizedUsername = (username || '').trim().toLowerCase()
    if (!normalizedUsername) {
      return { ok: false, message: 'Username is required for OTP.' }
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = Date.now() + 2 * 60 * 1000

    setAdminOtpChallenges((prev) => {
      const remaining = prev.filter((item) => item.username !== normalizedUsername)
      return [...remaining, { username: normalizedUsername, code, expiresAt }]
    })

    return { ok: true, code }
  }

  const verifyAdminOtp = ({ username, code }) => {
    const normalizedUsername = (username || '').trim().toLowerCase()
    const normalizedCode = (code || '').trim()

    const challenge = adminOtpChallenges.find((item) => item.username === normalizedUsername)
    if (!challenge) {
      return { ok: false, message: 'No OTP request found. Please request OTP again.' }
    }

    if (Date.now() > challenge.expiresAt) {
      setAdminOtpChallenges((prev) => prev.filter((item) => item.username !== normalizedUsername))
      return { ok: false, message: 'OTP expired. Please request a new one.' }
    }

    if (challenge.code !== normalizedCode) {
      return { ok: false, message: 'Invalid OTP code.' }
    }

    setAdminOtpChallenges((prev) => prev.filter((item) => item.username !== normalizedUsername))
    return { ok: true }
  }

  const addEvent = (payload) => {
    const event = { id: createId(), ...payload, seats: Number(payload.seats) }
    setEvents((prev) => [event, ...prev])
  }

  const updateEvent = (id, payload) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, ...payload, seats: Number(payload.seats) } : event,
      ),
    )
  }

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
    setEventRegistrations((prev) => prev.filter((registration) => registration.eventId !== id))
  }

  const registerForEvent = (id, studentId) => {
    const normalizedStudentId = (studentId || '').trim()
    if (!normalizedStudentId) {
      return { ok: false, reason: 'invalid-user' }
    }

    const alreadyRegistered = eventRegistrations.some(
      (registration) => registration.eventId === id && registration.studentId === normalizedStudentId,
    )

    if (alreadyRegistered) {
      return { ok: false, reason: 'already-registered' }
    }

    let didRegister = false

    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== id || event.seats <= 0) {
          return event
        }

        didRegister = true
        return { ...event, seats: event.seats - 1 }
      }),
    )

    if (!didRegister) {
      return { ok: false, reason: 'no-seats' }
    }

    setEventRegistrations((prev) => [
      ...prev,
      {
        id: createId(),
        eventId: id,
        studentId: normalizedStudentId,
      },
    ])

    return { ok: true }
  }

  const submitFeedback = ({ studentId, message }) => {
    const newFeedback = {
      id: createId(),
      studentId,
      message,
      createdAt: new Date().toISOString().split('T')[0],
      reply: '',
    }

    setFeedbacks((prev) => [newFeedback, ...prev])
  }

  const replyToFeedback = (id, reply) => {
    setFeedbacks((prev) => prev.map((item) => (item.id === id ? { ...item, reply } : item)))
  }

  const bookSession = ({ studentId, date, concern }) => {
    const newSession = {
      id: createId(),
      studentId,
      date,
      concern,
      status: 'pending',
      responseMessage: '',
    }

    setSessions((prev) => [newSession, ...prev])
  }

  const updateSession = (id, status, responseMessage) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              status,
              responseMessage,
            }
          : session,
      ),
    )
  }

  const addCounselor = (payload) => {
    const newCounselor = { id: createId(), ...payload }
    setCounselors((prev) => [newCounselor, ...prev])
  }

  const metrics = useMemo(() => {
    const openSeats = events.reduce((sum, event) => sum + event.seats, 0)
    const repliedFeedbacks = feedbacks.filter((item) => item.reply.trim().length > 0).length
    const pendingSessions = sessions.filter((session) => session.status === 'pending').length

    return {
      totalEvents: events.length,
      openSeats,
      totalFeedbacks: feedbacks.length,
      repliedFeedbacks,
      totalSessions: sessions.length,
      pendingSessions,
      counselors: counselors.length,
    }
  }, [events, feedbacks, sessions, counselors])

  const value = {
    auth,
    events,
    eventRegistrations,
    feedbacks,
    sessions,
    counselors,
    metrics,
    users,
    login,
    logout,
    registerUser,
    authenticateUser,
    requestAdminOtp,
    verifyAdminOtp,
    addEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    submitFeedback,
    replyToFeedback,
    bookSession,
    updateSession,
    addCounselor,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
