import { BadgeCheck, Menu, LogOut } from 'lucide-react'

const AdminTopbar = ({ onMenuClick, onLogout }) => {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:left-65">
      <div className="flex items-center gap-3">
        <button className="cursor-pointer text-gray-700 lg:hidden" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <BadgeCheck className="text-customGreenDark shrink-0" size={22} />
          <span className="text-lg font-bold text-gray-900">Motivo Logs Admin</span>
        </div>
      </div>

      <button className="cursor-pointer text-gray-700" onClick={onLogout} aria-label="Log out">
        <LogOut size={20} />
      </button>
    </header>
  )
}

export default AdminTopbar
