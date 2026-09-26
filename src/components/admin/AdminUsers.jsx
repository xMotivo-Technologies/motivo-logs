import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import adminApi from '../../lib/adminApi'

const PAGE_SIZE = 20

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    adminApi
      .get('/admin/users', { params: { page, limit: PAGE_SIZE } })
      .then(({ data }) => {
        setUsers(data.data || [])
        setPagination(data.pagination)
      })
      .catch(() => {
        setUsers([])
        setPagination(null)
      })
      .finally(() => setIsLoading(false))
  }, [page])

  return (
    <div className="p-4 sm:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold text-customGreenDark">Users</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Username</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Balance</th>
                <th className="px-3 py-2">Joined</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-gray-400">
                    <Loader2 size={18} className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-gray-400">
                    No users yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100">
                    <td className="px-3 py-3 font-semibold text-gray-900">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-3 py-3 text-gray-600">@{u.username}</td>
                    <td className="px-3 py-3 text-gray-600">{u.email}</td>
                    <td className="px-3 py-3 text-gray-600">₦{u.balance.toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3 text-right">
                      <Link to={`/admin/users/${u._id}`} className="font-semibold text-customGreen hover:text-customGreenDark">
                        View
                      </Link>
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

export default AdminUsers
