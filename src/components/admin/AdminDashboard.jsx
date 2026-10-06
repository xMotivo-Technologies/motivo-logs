import { useEffect, useState } from 'react'
import { Loader2, TrendingUp, DollarSign, RotateCcw, Clock, Wallet, Users, Receipt, UserPlus, Percent, BadgePercent } from 'lucide-react'
import adminApi from '../../lib/adminApi'

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-customGreenBright/20">
      <Icon size={20} className="text-customGreenDark" />
    </div>
    <div className="mb-1 text-sm text-gray-500">{label}</div>
    <div className={`text-2xl font-bold ${tone === 'negative' ? 'text-red-500' : 'text-gray-900'}`}>{value}</div>
  </div>
)

const naira = (n) => `₦${(n ?? 0).toLocaleString()}`
const percent = (n) => `${(n ?? 0).toFixed(1)}%`

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi
      .get('/admin/analytics')
      .then(({ data }) => setAnalytics(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="mb-5 text-xl font-semibold text-customGreenDark">Analytics</h2>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value={naira(analytics.totalRevenue)} />
        <StatCard icon={DollarSign} label="Total Profit" value={naira(analytics.totalProfit)} />
        <StatCard icon={RotateCcw} label="Total Refunded" value={naira(analytics.totalRefunded)} tone="negative" />
        <StatCard icon={Clock} label="Pending Amount" value={naira(analytics.pendingAmount)} />
        <StatCard icon={Wallet} label="Wallet Deposits" value={naira(analytics.totalDeposits)} />
        <StatCard icon={Receipt} label="Completed Orders" value={analytics.completedOrders?.toLocaleString()} />
        <StatCard icon={Users} label="Total Users" value={analytics.totalUsers?.toLocaleString()} />
        <StatCard icon={Receipt} label="Total Transactions" value={analytics.totalTransactions?.toLocaleString()} />
        <StatCard icon={UserPlus} label="Paying Users" value={analytics.payingUsers?.toLocaleString()} />
        <StatCard icon={Percent} label="Conversion Rate" value={percent(analytics.conversionRate)} />
        <StatCard icon={BadgePercent} label="Refund Rate" value={percent(analytics.refundRate)} tone={analytics.refundRate > 20 ? 'negative' : undefined} />
        <StatCard icon={DollarSign} label="Avg Revenue / Paying User" value={naira(analytics.avgRevenuePerUser)} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Services</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-100 text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                  <th className="px-3 py-2">Service</th>
                  <th className="px-3 py-2">Orders</th>
                  <th className="px-3 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {!analytics.topServices?.length ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center text-gray-400">
                      No completed orders yet.
                    </td>
                  </tr>
                ) : (
                  (analytics.topServices ?? []).map((s) => (
                    <tr key={s.name} className="border-b border-gray-100">
                      <td className="px-3 py-3 text-gray-700 capitalize">{s.name}</td>
                      <td className="px-3 py-3 text-gray-600">{s.orders}</td>
                      <td className="px-3 py-3 font-semibold text-gray-900">{naira(s.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Countries</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-100 text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                  <th className="px-3 py-2">Country</th>
                  <th className="px-3 py-2">Orders</th>
                  <th className="px-3 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {!analytics.topCountries?.length ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center text-gray-400">
                      No completed orders yet.
                    </td>
                  </tr>
                ) : (
                  (analytics.topCountries ?? []).map((c) => (
                    <tr key={c.name} className="border-b border-gray-100">
                      <td className="px-3 py-3 text-gray-700 capitalize">{c.name}</td>
                      <td className="px-3 py-3 text-gray-600">{c.orders}</td>
                      <td className="px-3 py-3 font-semibold text-gray-900">{naira(c.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Revenue — Last 30 Days</h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-100 text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Orders</th>
                  <th className="px-3 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {!analytics.dailyBreakdown?.length ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center text-gray-400">
                      No orders in the last 30 days.
                    </td>
                  </tr>
                ) : (
                  (analytics.dailyBreakdown ?? []).map((d) => (
                    <tr key={d.date} className="border-b border-gray-100">
                      <td className="px-3 py-3 text-gray-700">{d.date}</td>
                      <td className="px-3 py-3 text-gray-600">{d.orders}</td>
                      <td className="px-3 py-3 font-semibold text-gray-900">{naira(d.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">New Signups — Last 30 Days</h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-100 text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">New Signups</th>
                </tr>
              </thead>
              <tbody>
                {!analytics.dailySignups?.length ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-8 text-center text-gray-400">
                      No signups in the last 30 days.
                    </td>
                  </tr>
                ) : (
                  (analytics.dailySignups ?? []).map((d) => (
                    <tr key={d.date} className="border-b border-gray-100">
                      <td className="px-3 py-3 text-gray-700">{d.date}</td>
                      <td className="px-3 py-3 font-semibold text-gray-900">{d.signups}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
