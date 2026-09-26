import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingBag, Receipt } from 'lucide-react'

const menu = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/transactions', label: 'Transactions', icon: Receipt },
]

const AdminSidebar = ({ admin, isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-20 bg-black/35 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-65 overflow-y-auto border-r border-gray-200 bg-white p-3
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="mt-2 mb-4 flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-customGreenDark font-semibold text-white">
            {admin.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900">{admin.name}</div>
            <div className="truncate text-xs text-gray-500">{admin.email}</div>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5">
          {menu.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                  isActive ? 'bg-customGreenBright/20 font-semibold text-customGreenDark' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default AdminSidebar
