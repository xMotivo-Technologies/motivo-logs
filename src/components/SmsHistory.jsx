import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import api from '../lib/api'

const PAGE_SIZE = 20

const ORDER_STATUS_STYLES = {
  completed: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  cancelled: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  expired: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  pending: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400',
}

const formatOrderDate = (dateStr) => {
  const date = new Date(dateStr)
  const day = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${day}, ${time}`
}

const naira = (n) => `₦${(n ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const SmsHistory = () => {
  const [orders, setOrders] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersPagination, setOrdersPagination] = useState(null)
  const [cancellingOrderId, setCancellingOrderId] = useState(null)

  const loadOrders = () => {
    setIsLoadingOrders(true)
    api
      .get('/orders', { params: { page: ordersPage, limit: PAGE_SIZE } })
      .then(({ data }) => {
        setOrders(data.data || [])
        setOrdersPagination(data.pagination)
      })
      .catch(() => {
        setOrders([])
        setOrdersPagination(null)
      })
      .finally(() => setIsLoadingOrders(false))
  }

  useEffect(loadOrders, [ordersPage])

  const handleCancelHistoryOrder = async (orderId) => {
    setCancellingOrderId(orderId)
    try {
      await api.post(`/order/${orderId}/cancel`)
      loadOrders()
    } catch {
      // the row simply stays "pending" if this fails — keep it simple
    } finally {
      setCancellingOrderId(null)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-customDarkSurface">
        <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">SMS Order History</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase dark:bg-white/5 dark:text-gray-400">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingOrders ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                    <Loader2 size={18} className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                    No verification purchases yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-100 dark:border-white/10">
                    <td className="px-4 py-4">
                      <Link
                        to={`/sms-verification/${o.orderId}`}
                        className="font-medium text-customGreen hover:underline dark:text-customGreenBright"
                      >
                        {o.orderId}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{formatOrderDate(o.createdAt)}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{o.phone || '—'}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{o.code || ''}</td>
                    <td className="px-4 py-4 text-gray-600 capitalize dark:text-gray-400">{o.service}</td>
                    <td className="px-4 py-4 text-gray-800 dark:text-gray-200">{naira(o.amount)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          ORDER_STATUS_STYLES[o.status] || 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {o.status === 'pending' && (
                        <button
                          onClick={() => handleCancelHistoryOrder(o.orderId)}
                          disabled={cancellingOrderId === o.orderId}
                          className="cursor-pointer text-sm font-semibold text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-red-400 dark:hover:text-red-300 dark:disabled:text-gray-600"
                        >
                          {cancellingOrderId === o.orderId ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {ordersPagination && ordersPagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              Page {ordersPagination.page} of {ordersPagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setOrdersPage((p) => p - 1)}
                disabled={!ordersPagination.hasPrevPage}
                className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/5"
              >
                Previous
              </button>
              <button
                onClick={() => setOrdersPage((p) => p + 1)}
                disabled={!ordersPagination.hasNextPage}
                className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/5"
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

export default SmsHistory
