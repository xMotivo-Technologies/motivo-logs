import { Navigate, Outlet } from 'react-router-dom'

// Blocks access to the app shell unless a user is logged in.
export const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

// Keeps a logged-in user off /login and /register.
export const PublicRoute = ({ user }) => {
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export default ProtectedRoute
