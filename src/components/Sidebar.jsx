import { Link, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Plus,
  MessageSquare,
  Mail,
  Zap,
  Users,
  Shield,
  FileText,
  MessageCircle,
  HelpCircle,
  KeyRound,
  ChevronRight,
} from 'lucide-react'

// Menu items shown in the middle of the sidebar
const mainMenu = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/fund-wallet', label: 'Fund Wallet', icon: Plus, hasSubmenu: true },
  { path: '/sms-verification', label: 'SMS Verification', icon: MessageSquare, hasSubmenu: true },
  // { path: '/temp-email', label: 'Temp Email', icon: Mail },
  // { path: '/pay-utilities-bills', label: 'Pay Utilities Bills', icon: Zap, hasSubmenu: true },
  // { path: '/refer-and-earn', label: 'Refer & Earn', icon: Users },
  // { path: '/proxies', label: 'Proxies', icon: Shield, comingSoon: true },
]

// Menu items shown at the bottom of the sidebar
const bottomMenu = [
  { path: '/transactions', label: 'Transactions', icon: FileText },
  { path: '/support-chat', label: 'Support Chat', icon: MessageCircle },
  { path: '/faq', label: 'FAQ', icon: HelpCircle },
  // { path: '/api-token', label: 'API Token', icon: KeyRound },
]

const Sidebar = ({ user, isOpen, onClose }) => {
  const renderItem = (item) => {
    const Icon = item.icon 

    if (item.comingSoon) {
      return (
        <span
          key={item.path}
          className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 dark:text-gray-600"
        >
          <Icon size={18} className="shrink-0" />
          <span className="flex-1">{item.label}</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400 dark:bg-white/10 dark:text-gray-500">Soon</span>
        </span>
      )
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
            isActive
              ? 'bg-customGreenBright/20 font-semibold text-customGreenDark dark:bg-customGreenBright/15 dark:text-customGreenBright'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'
          }`
        }
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1">{item.label}</span>
        {item.hasSubmenu && <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />}
      </NavLink>
    )
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-20 bg-black/35 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-65 overflow-y-auto border-r border-gray-200 bg-white p-3
          dark:border-white/10 dark:bg-customDarkSurface
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} lg:translate-x-0`}
      >
        <Link
          to="/profile"
          onClick={onClose}
          className="mt-2 mb-4 flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-customGreenDark font-semibold text-white">
            {user.initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">₦{user.balance.toLocaleString()}</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-0.5">{mainMenu.map(renderItem)}</nav>

        <div className="mx-1 my-4 h-px bg-gray-200 dark:bg-white/10" />

        <nav className="flex flex-col gap-0.5">{bottomMenu.map(renderItem)}</nav>
      </aside>
    </>
  )
}

export default Sidebar
