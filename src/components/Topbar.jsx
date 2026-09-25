import { Menu, Bell, BadgeCheck, LogOut } from 'lucide-react'

const Topbar = ({ user, onMenuClick, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 lg:left-65 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-gray-700 cursor-pointer" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <BadgeCheck className="text-customBlueDark shrink-0" size={22} />
          <span className="text-lg font-bold text-gray-900">Motivo Logs</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-700 cursor-pointer" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-customBlueDark text-white flex items-center justify-center text-sm font-semibold">
          {user.initials}
        </div>
        <button className="text-gray-700 cursor-pointer" onClick={onLogout} aria-label="Log out">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}

export default Topbar
