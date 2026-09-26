import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import adminApi from '../../lib/adminApi'

const PAGE_SIZE = 20
const STATUS_FILTERS = ['All', 'Pending', 'Success', 'Failed']

const STATUS_STYLES = {
  success: 'bg-green-50 text-green-600',
  pending: 'bg-yellow-50 text-yellow-600',
  failed: 'bg-red-50 text-red-600',
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    setIsLoading(true)
    adminApi
      .get('/admin/orders', {
        params: {
          page,
          limit: PAGE_SIZE,
          status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase(),
        },
      })
      .then(({ data }) => {
        setOrders(data.data || [])
        setPagination(data.pagination)
      })
      .catch(() => {
        setOrders([])
        setPagination(null)
      })
      .finally(() => setIsLoading(false))
  }, [page, statusFilter])

  return (
    <div className="p-4 sm:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-customGreenDark">Orders</h2>
          <div className="flex gap-2">
            {STATUS_FILTERS.map((label) => (
              <button
                key={label}
                onClick={() => {
                  setStatusFilter(label)
                  setPage(1)
                }}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium ${
                  statusFilter === label ? 'bg-customGreen text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Date</th>
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
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-100">
                    <td className="px-3 py-3 font-mono text-xs text-gray-500">{o.reference}</td>
                    <td className="px-3 py-3 text-gray-700">
                      {o.user ? `${o.user.firstName} ${o.user.lastName}` : '—'}
                    </td>
                    <td className="px-3 py-3 text-gray-600 capitalize">{o.meta?.country || '—'}</td>
                    <td className="px-3 py-3 text-gray-600 capitalize">{o.meta?.product || '—'}</td>
                    <td className={`px-3 py-3 font-semibold ${o.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                      {o.type === 'credit' ? '+' : '-'}₦{o.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-gray-600">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                          STATUS_STYLES[o.status] || 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {o.status}
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

export default AdminOrders
