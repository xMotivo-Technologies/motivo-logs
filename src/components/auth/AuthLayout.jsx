import { BadgeCheck } from 'lucide-react'

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-customDarkBg">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          {/* <BadgeCheck className="text-customBlueDark" size={26} /> */}
          <img className='h-10' src="images/logo.png" alt="Motivo Logs Logo" />
          <span className="text-xl font-bold text-customGreenDark dark:text-white">Motivo Logs</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-customDarkSurface">
          <h1 className="mb-1 text-xl font-semibold text-customGreen dark:text-customGreenBright">{title}</h1>
          {subtitle && <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
