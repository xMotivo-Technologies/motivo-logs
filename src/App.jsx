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
import Support from './components/Support'
import FAQ from './components/FAQ'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import api from './lib/api'
import AdminLayout from './components/admin/layout/AdminLayout'
import { AdminProtectedRoute, AdminPublicRoute } from './components/admin/layout/AdminProtectedRoute'
import AdminLogin from './components/admin/auth/AdminLogin'
import AdminRegister from './components/admin/auth/AdminRegister'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminUsers from './components/admin/AdminUsers'
import AdminUserDetail from './components/admin/AdminUserDetail'
import AdminOrders from './components/admin/AdminOrders'
import AdminTransactions from './components/admin/AdminTransactions'

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

const getStoredAdmin = () => {
  const saved = localStorage.getItem('adminUser')
  if (!saved) return null

  try {
    return JSON.parse(saved)
  } catch {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminUser')
    return null
  }
}

const App = () => {
  const [user, setUser] = useState(getStoredUser)
  const [balance, setBalance] = useState(0)
  const [admin, setAdmin] = useState(getStoredAdmin)

  const fetchBalance = () => {
    return api
      .get('/get-wallet-balance')
      .then(({ data }) => setBalance(data.balance))
      .catch(() => setBalance(0))
  }

  useEffect(() => {
    if (!user) return
    fetchBalance()
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

  const handleAdminAuthSuccess = (loggedInAdmin, accessToken) => {
    localStorage.setItem('adminAccessToken', accessToken)
    localStorage.setItem('adminUser', JSON.stringify(loggedInAdmin))
    setAdmin(loggedInAdmin)
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminUser')
    setAdmin(null)
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
          <Route path="/dashboard" element={<Dashboard user={currentUser} onRefreshBalance={fetchBalance} />} />
          <Route path="/sms-verification" element={<SmsVerification />} />
          <Route path="/fund-wallet" element={<FundWallet />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile user={user} onUpdate={handleProfileUpdate} />} />
          <Route path="/support-chat" element={<Support />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>
      </Route>

      <Route element={<AdminPublicRoute admin={admin} />}>
        <Route path="/admin/login" element={<AdminLogin onSuccess={handleAdminAuthSuccess} />} />
        <Route path="/admin/register" element={<AdminRegister />} />
      </Route>

      <Route element={<AdminProtectedRoute admin={admin} />}>
        <Route element={<AdminLayout admin={admin} onLogout={handleAdminLogout} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
