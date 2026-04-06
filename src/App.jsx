import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSignUpPage from './pages/AdminSignUpPage'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import StudentLayout from './pages/student/StudentLayout'
import { useApp } from './context/AppContext'
import { isLoggedIn } from './utils/auth'

function NotFoundRedirect() {
  return <Navigate to="/" replace />
}

function ProtectedRoute({ children }) {
  const { auth } = useApp()

  if (!auth.isAuthenticated && !isLoggedIn()) {
    return <Navigate to="/signin" replace />
  }

  return children
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin-signup" element={<AdminSignUpPage />} />
          <Route
            path="/student"
            element={(
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
