import { useEffect, useState } from 'react'
import { Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import api from '../lib/api'

const PAGE_SIZE = 20
const TYPE_FILTERS = ['All', 'Credit', 'Debit']

const STATUS_STYLES = {
  success: 'bg-green-50 text-green-600',
  pending: 'bg-yellow-50 text-yellow-600',
  failed: 'bg-red-50 text-red-600',
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

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    setIsLoading(true)
    api
      .get('/get-transactions', { params: { page, limit: PAGE_SIZE } })
      .then(({ data }) => {
        setTransactions(data.data || [])
        setPagination(data.pagination)
      })
      .catch(() => {
        setTransactions([])
        setPagination(null)
      })
      .finally(() => setIsLoading(false))
  }, [page])

  const filtered = typeFilter === 'All' ? transactions : transactions.filter((t) => t.type === typeFilter.toLowerCase())

  return (
    <div className="p-4 sm:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-customGreenDark">Transactions</h2>
          <div className="flex gap-2">
            {TYPE_FILTERS.map((label) => (
              <button
                key={label}
                onClick={() => setTypeFilter(label)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium ${
                  typeFilter === label ? 'bg-customGreen text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Balance</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-400">
                    <Loader2 size={18} className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-400">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id} className="border-b border-gray-100">
                    <td className="px-3 py-3">
                      {t.type === 'credit' ? (
                        <span className="flex items-center gap-1.5 font-medium text-green-600">
                          <ArrowDownCircle size={16} /> Credit
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 font-medium text-red-500">
                          <ArrowUpCircle size={16} /> Debit
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-700 capitalize">{describeTransaction(t)}</td>
                    <td className="px-3 py-3 font-mono text-xs text-gray-500">{t.reference}</td>
                    <td className="px-3 py-3 text-gray-600">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className={`px-3 py-3 font-semibold ${t.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.type === 'credit' ? '+' : '-'}₦{t.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {t.currentBalance != null ? `₦${t.currentBalance.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                          STATUS_STYLES[t.status] || 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrevPage}
                className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Transactions
