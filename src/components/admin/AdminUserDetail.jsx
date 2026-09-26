import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import adminApi from '../../lib/adminApi'

const STATUS_STYLES = {
  success: 'bg-green-50 text-green-600',
  pending: 'bg-yellow-50 text-yellow-600',
  failed: 'bg-red-50 text-red-600',
}

const AdminUserDetail = () => {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi
      .get(`/admin/users/${id}`)
      .then(({ data }) => setDetail(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="p-4 sm:p-6">
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error || 'User not found'}</p>
      </div>
    )
  }

  const { user, wallet, virtualAccount, transactions } = detail

  return (
    <div className="p-4 sm:p-6">
      <Link to="/admin/users" className="mb-4 flex w-fit items-center gap-1.5 text-sm font-semibold text-customGreen hover:text-customGreenDark">
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-customGreenDark">
            {user.firstName} {user.lastName}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs tracking-wide text-gray-500 uppercase">Username</div>
              <div className="font-medium text-gray-900">@{user.username}</div>
            </div>
            <div>
              <div className="text-xs tracking-wide text-gray-500 uppercase">Email</div>
              <div className="font-medium text-gray-900">{user.email}</div>
            </div>
            <div>
              <div className="text-xs tracking-wide text-gray-500 uppercase">Phone Number</div>
              <div className="font-medium text-gray-900">{user.phoneNumber}</div>
            </div>
            <div>
              <div className="text-xs tracking-wide text-gray-500 uppercase">Joined</div>
              <div className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">Wallet</h3>
          <div className="mb-4 text-3xl font-bold text-gray-900">₦{(wallet?.balance ?? 0).toLocaleString()}</div>

          {virtualAccount?.dedicatedAccount ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="text-gray-500">{virtualAccount.dedicatedAccount.bank?.name}</div>
              <div className="font-semibold text-gray-900">{virtualAccount.dedicatedAccount.account_number}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No virtual account generated yet.</p>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Transactions</h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-gray-400">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t._id} className="border-b border-gray-100">
                    <td className="px-3 py-3 font-medium text-gray-700 capitalize">{t.type}</td>
                    <td className="px-3 py-3 font-mono text-xs text-gray-500">{t.reference}</td>
                    <td className="px-3 py-3 text-gray-600">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className={`px-3 py-3 font-semibold ${t.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.type === 'credit' ? '+' : '-'}₦{t.amount.toLocaleString()}
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
      </section>
    </div>
  )
}

export default AdminUserDetail
