import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import api from '../lib/api'

const RECENT_LIMIT = 5

const STATUS_STYLES = {
  success: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  pending: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400',
  failed: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
}

const describeTransaction = (t) => {
  if (t.meta?.service === '5sim_activation') {
    return `SMS Verification — ${t.meta.product ?? ''}${t.meta.country ? ` (${t.meta.country})` : ''}`.trim()
  }
  if (t.meta?.service === '5sim_activation_refund') {
    return `Refund — ${t.meta.product ?? ''}${t.meta.country ? ` (${t.meta.country})` : ''}`.trim()
  }
  if (t.source === 'PAYSTACK') return 'Wallet Funding'
  return t.description || 'Transaction'
}

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get('/get-transactions', { params: { page: 1, limit: RECENT_LIMIT } })
      .then(({ data }) => setTransactions(data.data || []))
      .catch(() => setTransactions([]))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-customDarkSurface">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg text-gray-900 dark:text-white">Recent Transactions</h2>
        <Link to="/transactions" className="text-sm font-semibold text-customGreenDark hover:underline dark:text-customGreenBright">
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-400 dark:text-gray-500">
          <Loader2 size={18} className="mx-auto animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No transactions yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/10">
          {transactions.map((t) => (
            <div key={t._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    t.type === 'credit'
                      ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                      : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
                  }`}
                >
                  {t.type === 'credit' ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900 capitalize dark:text-gray-100">{describeTransaction(t)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div
                  className={`text-sm font-semibold ${
                    t.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {t.type === 'credit' ? '+' : '-'}₦{t.amount.toLocaleString()}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                    STATUS_STYLES[t.status] || 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecentTransactions
