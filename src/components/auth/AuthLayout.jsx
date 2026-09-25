import { BadgeCheck } from 'lucide-react'

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <BadgeCheck className="text-customBlueDark" size={26} />
          <span className="text-xl font-bold text-gray-900">Motivo Logs</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <h1 className="mb-1 text-xl font-semibold text-customBlueDark">{title}</h1>
          {subtitle && <p className="mb-6 text-sm text-gray-600">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
