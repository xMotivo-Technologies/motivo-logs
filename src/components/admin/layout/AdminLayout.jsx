import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminTopbar from './AdminTopbar'
import AdminSidebar from './AdminSidebar'

const AdminLayout = ({ admin, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminTopbar onMenuClick={() => setSidebarOpen(true)} onLogout={onLogout} />

      <AdminSidebar admin={admin} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 lg:ml-65">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
