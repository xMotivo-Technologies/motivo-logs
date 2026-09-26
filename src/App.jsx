import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute, { PublicRoute } from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './components/Dashboard'
import SmsVerification from './components/SmsVerification'
import FundWallet from './components/FundWallet'
import Transactions from './components/Transactions'
import Profile from './components/Profile'
import ComingSoon from './components/ComingSoon'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import api from './lib/api'

const getStoredUser = () => {
  const saved = localStorage.getItem('user')
  if (!saved) return null

  try {
    const parsed = JSON.parse(saved)
    if (!parsed?.firstName || !parsed?.lastName) throw new Error('Malformed stored user')
    return parsed
  } catch {
    // Stale or malformed data from an earlier session — drop it.
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    return null
  }
}

const App = () => {
  const [user, setUser] = useState(getStoredUser)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (!user) return
    api
      .get('/get-wallet-balance')
      .then(({ data }) => setBalance(data.balance))
      .catch(() => setBalance(0))
  }, [user])

  const handleAuthSuccess = (loggedInUser, accessToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    api.post('/logout').catch(() => {})
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const handleProfileUpdate = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const currentUser = user && {
    name: `${user.firstName} ${user.lastName}`,
    initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
    balance,
  }

  return (
    <Routes>
      <Route path="/" element={<Home isLoggedIn={!!user} />} />

      <Route element={<PublicRoute user={user} />}>
        <Route path="/login" element={<Login onSuccess={handleAuthSuccess} />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<ProtectedRoute user={user} />}>
        <Route element={<AppLayout user={currentUser} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
          <Route path="/sms-verification" element={<SmsVerification />} />
          <Route path="/fund-wallet" element={<FundWallet />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile user={user} onUpdate={handleProfileUpdate} />} />
          <Route path="/support-chat" element={<ComingSoon pageName="Support Chat" />} />
          <Route path="/faq" element={<ComingSoon pageName="FAQ" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
