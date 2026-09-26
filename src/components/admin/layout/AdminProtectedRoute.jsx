import { Navigate, Outlet } from 'react-router-dom'

// Blocks access to the admin panel unless an admin is logged in.
export const AdminProtectedRoute = ({ admin }) => {
  if (!admin) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

// Keeps a logged-in admin off /admin/login and /admin/register.
export const AdminPublicRoute = ({ admin }) => {
  if (admin) return <Navigate to="/admin" replace />
  return <Outlet />
}

export default AdminProtectedRoute
