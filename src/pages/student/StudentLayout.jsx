import { useEffect } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import TopNav from '../../components/TopNav'
import { useApp } from '../../context/AppContext'
import StudentDashboard from './StudentDashboard'

const sections = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'events', label: 'Events & Workshops' },
  { key: 'counselor', label: 'Counselor Connect' },
  { key: 'feedback', label: 'Feedback' },
]

export default function StudentLayout() {
  const { auth, logout } = useApp()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  if (!auth.isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  const activeSection = params.get('tab') || 'dashboard'

  const tabLinks = sections.map((section) => ({
    to: `/student?tab=${section.key}`,
    label: section.label,
  }))

  useEffect(() => {
    if (!sections.find((section) => section.key === activeSection)) {
      setParams({ tab: 'dashboard' })
    }
  }, [activeSection, setParams])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-emerald-100">
      <TopNav title="Health Hub" links={tabLinks} onLogout={handleLogout} showLogo={false} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 lg:py-10">
        <StudentDashboard section={activeSection} />
      </main>
    </div>
  )
}
