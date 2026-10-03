import { useState } from 'react'
import { CreditCard, Eye, EyeOff, Plus, RefreshCw, Smartphone, Clock, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import RecentTransactions from './RecentTransactions'

const quickServices = [
  { link: '/sms-verification', title: 'Sms Verification', icon: Smartphone },
  { title: 'Rent Numbers', icon: Clock, comingSoon: true },
  { title: 'Buy Logs', icon: Lock, comingSoon: true },
]

const Dashboard = ({ user, onRefreshBalance }) => {
  const [showBalance, setShowBalance] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefreshBalance = async () => {
    if (!onRefreshBalance) return
    setRefreshing(true)
    try {
      await onRefreshBalance()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="max-w-3xl p-4 sm:p-6">
      <section className="rounded-2xl bg-customGreenDark p-6 text-white">
        <div className="mb-5 flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/25 text-lg font-semibold">
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-lg font-bold">
              {user.name} 
            </div>
            <div className="text-sm text-white/85">Welcome back!</div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-white/90">
            <CreditCard size={16} /> Balance
            <button
              type="button"
              onClick={() => setShowBalance((v) => !v)}
              className="cursor-pointer text-white/90 hover:text-white"
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">{showBalance ? `₦${user.balance.toLocaleString()}` : '₦••••••'}</div>
            <button
              type="button"
              onClick={handleRefreshBalance}
              disabled={refreshing}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white/90 hover:bg-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Refresh balance"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        
        <Link to="/fund-wallet" className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-customGreenBright py-3.5 font-semibold text-customGreenDark ">
          <Plus size={16} /> Deposit Funds
        </Link>
      </section>

      <h2 className="mt-6 mb-3.5 text-lg text-gray-900 dark:text-white">Quick Services</h2>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {quickServices.map((service) => {
          const Icon = service.icon

          if (service.comingSoon) {
            return (
              <div
                key={service.title}
                className="relative flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center sm:p-6 dark:border-white/10 dark:bg-white/5"
              >
                <span className="absolute top-2.5 right-2.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-[9px] font-bold text-gray-500 dark:bg-white/10 dark:text-gray-400">
                  SOON
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-200 text-gray-400 sm:h-12 sm:w-12 dark:bg-white/10 dark:text-gray-500">
                  <Icon size={20} />
                </div>
                <div className="text-sm font-semibold text-gray-400 dark:text-gray-500">{service.title}</div>
              </div>
            )
          }

          return (
            <Link
              key={service.title}
              to={service.link}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-4 text-center hover:shadow-md sm:p-6 dark:border-white/10 dark:bg-customDarkSurface dark:hover:bg-customDarkSurfaceHover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white sm:h-12 sm:w-12">
                <Icon size={20} />
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{service.title}</div>
            </Link>
          )
        })}
      </div>

      <RecentTransactions />
    </div>
  )
}

export default Dashboard
