import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from '../Topbar'
import Sidebar from '../Sidebar'
import MarqueeBanner from '../MarqueeBanner'
import AnnouncementModal from '../AnnouncementModal'

const AppLayout = ({ user, onLogout, theme, onToggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-customDarkBg">
      <Topbar user={user} onMenuClick={() => setSidebarOpen(true)} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />

      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <AnnouncementModal />

      <main className="pt-16 lg:ml-65">
        <MarqueeBanner />
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
