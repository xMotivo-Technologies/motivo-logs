import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Contact', href: '#contact' },
]

const Navbar = ({ isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header-txt sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2">
          {/* <BadgeCheck className="text-customBlueDark" size={24} /> */}
          <img className='h-14' src="images/logo.png" alt="Motivo Logs Logo" />
          <span className="header-txt font-bold text-lg  text-gray-900">Motivo Logs</span>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-gray-600 hover:text-customGreen">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="rounded-lg bg-customGreen px-5 py-2 text-sm font-semibold text-white hover:bg-customGreenDark"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-customGreen">
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => window.ttq?.track('ClickButton')}
                className="rounded-lg bg-customGreen px-5 py-2 text-sm font-semibold text-white hover:bg-customGreenDark"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        <button className="cursor-pointer text-gray-700 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {isLoggedIn ? (
              <Link to="/dashboard" className="rounded-lg bg-customGreenDark px-5 py-2.5 text-center text-sm font-semibold text-white">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="rounded-lg border border-gray-300 px-5 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => {
                    setMenuOpen(false)
                    window.ttq?.track('ClickButton')
                  }}
                  className="rounded-lg bg-customGreenDark px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
