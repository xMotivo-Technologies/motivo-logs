import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Search, X } from 'lucide-react'
import adminApi from '../../lib/adminApi'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 400

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // Debounce the raw input into `search` so we're not firing a request on
  // every keystroke.
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [searchInput])

  useEffect(() => setPage(1), [search])

  useEffect(() => {
    setIsLoading(true)
    adminApi
      .get('/admin/users', { params: { page, limit: PAGE_SIZE, search: search || undefined } })
      .then(({ data }) => {
        setUsers(data.data || [])
        setPagination(data.pagination)
      })
      .catch(() => {
        setUsers([])
        setPagination(null)
      })
      .finally(() => setIsLoading(false))
  }, [page, search])

  return (
    <div className="p-4 sm:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-customGreenDark">Users</h2>

          <div className="relative w-full max-w-xs">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, username, email, phone..."
              className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-9 text-sm focus:border-customGreen focus:outline-none"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

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
                    {search ? `No users match "${search}".` : 'No users yet.'}
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
