import { Menu, Bell, BadgeCheck, LogOut, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'

const Topbar = ({ user, onMenuClick, onLogout, theme, onToggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 lg:left-65 h-16 bg-white dark:bg-customDarkSurface border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 z-10">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-gray-700 dark:text-gray-300 cursor-pointer" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          {/* <BadgeCheck className="text-customBlueDark shrink-0" size={22} /> */}
          <img className='h-10' src="images/logo.png" alt="Motivo Logs Logo" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">Motivo Logs</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleTheme}
          className="cursor-pointer rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        {/* <button className="text-gray-700 cursor-pointer" aria-label="Notifications">
          <Bell size={20} />
        </button> */}
        <Link to= "/profile" >
        <div className="w-8 h-8 rounded-full bg-customGreenDark text-white flex items-center justify-center text-sm font-semibold">
          {user.initials}
        </div>
        </Link>
        <button className="text-gray-700 dark:text-gray-300 cursor-pointer" onClick={onLogout} aria-label="Log out">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}

export default Topbar
