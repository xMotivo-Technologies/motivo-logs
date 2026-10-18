import { useEffect, useState } from 'react'
import Select from 'react-select'
import * as Flags from 'country-flag-icons/react/3x2'
import { Loader2, Plus, Trash2, Check } from 'lucide-react'
import adminApi from '../../lib/adminApi'

const emptyForm = { service: '', country: '', operator: '' }

// Mirrors the customer-facing SMS Verification page's naming override.
const COUNTRY_LABEL_OVERRIDES = { england: 'UK' }

// Shared look for both comboboxes — same visual language as the customer
// purchase form's country/service selects, just without dark-mode variants
// since the admin panel stays light-only.
const selectClassNames = {
  control: () => 'w-full rounded-lg border border-gray-300 py-1 pl-2 pr-1 focus-within:border-customGreen',
  placeholder: () => 'pl-2 text-gray-400',
  input: () => 'pl-2 text-gray-800',
  singleValue: () => 'pl-2 w-full text-gray-800',
  menu: () => 'z-20 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg',
  menuList: () => 'max-h-64 overflow-y-auto py-1',
  option: ({ isFocused, isSelected }) =>
    `cursor-pointer px-3 py-2 text-sm ${
      isSelected ? 'bg-gray-100 font-semibold text-customGreenDark' : isFocused ? 'bg-gray-50' : 'text-gray-800'
    }`,
  noOptionsMessage: () => 'px-3 py-2 text-sm text-gray-400',
  dropdownIndicator: () => 'cursor-pointer pr-2 text-gray-400',
  clearIndicator: () => 'cursor-pointer pr-1 text-gray-400',
  indicatorSeparator: () => 'hidden',
}

const CountryOptionLabel = ({ iso, label }) => {
  const Flag = Flags[iso]
  return (
    <span className="flex items-center gap-2">
      {Flag ? <Flag title={label} className="h-4 w-6 shrink-0 rounded-sm" /> : <span className="h-4 w-6 shrink-0" />}
      {label}
    </span>
  )
}

const AdminOperatorMappings = () => {
  const [mappings, setMappings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [markup, setMarkup] = useState(null)
  const [markupInput, setMarkupInput] = useState('')
  const [isLoadingMarkup, setIsLoadingMarkup] = useState(true)
  const [isSavingMarkup, setIsSavingMarkup] = useState(false)
  const [markupError, setMarkupError] = useState('')
  const [markupSaved, setMarkupSaved] = useState(false)

  const [countries, setCountries] = useState([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)

  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)

  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadMappings = () => {
    setIsLoading(true)
    adminApi
      .get('/admin/operator-mappings')
      .then(({ data }) => setMappings(data.data || []))
      .catch(() => setMappings([]))
      .finally(() => setIsLoading(false))
  }

  useEffect(loadMappings, [])

  const loadMarkup = () => {
    setIsLoadingMarkup(true)
    adminApi
      .get('/admin/settings/flat-markup')
      .then(({ data }) => {
        setMarkup(data)
        setMarkupInput(String(data.value))
      })
      .catch(() => setMarkup(null))
      .finally(() => setIsLoadingMarkup(false))
  }

  useEffect(loadMarkup, [])

  const handleSaveMarkup = async (e) => {
    e.preventDefault()
    setMarkupError('')
    setMarkupSaved(false)

    const numericValue = Number(markupInput)
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setMarkupError('Enter a valid, non-negative number')
      return
    }

    setIsSavingMarkup(true)
    try {
      await adminApi.put('/admin/settings/flat-markup', { value: numericValue })
      loadMarkup()
      setMarkupSaved(true)
      setTimeout(() => setMarkupSaved(false), 2000)
    } catch (err) {
      setMarkupError(err.message)
    } finally {
      setIsSavingMarkup(false)
    }
  }

  // Country list — loaded once, same source as the customer purchase form.
  useEffect(() => {
    adminApi
      .get('/countries')
      .then(({ data }) => {
        const list = Object.entries(data.countries || {}).map(([value, info]) => ({
          value,
          label: COUNTRY_LABEL_OVERRIDES[value] || info.text_en || value,
          iso: Object.keys(info.iso || {})[0]?.toUpperCase(),
        }))
        list.sort((a, b) => a.label.localeCompare(b.label))
        setCountries(list)
      })
      .catch(() => setCountries([]))
      .finally(() => setIsLoadingCountries(false))
  }, [])

  // Service list depends on the chosen country — same cascading behavior as
  // the purchase form, since 5sim's available services vary by country.
  useEffect(() => {
    setForm((f) => ({ ...f, service: '' }))
    setServices([])
    if (!form.country) return

    setIsLoadingServices(true)
    adminApi
      .get(`/products/${form.country}`)
      .then(({ data }) => {
        const list = Object.keys(data.products || {}).map((value) => ({ value, label: value }))
        list.sort((a, b) => a.label.localeCompare(b.label))
        setServices(list)
      })
      .catch(() => setServices([]))
      .finally(() => setIsLoadingServices(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.country])

  const updateOperator = (e) => setForm((f) => ({ ...f, operator: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.service || !form.country || !form.operator.trim()) {
      setError('Service, country, and operator are all required')
      return
    }

    setIsSaving(true)
    try {
      await adminApi.post('/admin/operator-mappings', form)
      setForm(emptyForm)
      setServices([])
      loadMappings()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await adminApi.delete(`/admin/operator-mappings/${id}`)
      loadMappings()
    } catch {
      // row just stays if this fails — keep it simple
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-customGreenDark">Flat Markup</h2>
        <p className="mt-1 mb-5 text-sm text-gray-500">
          The flat ₦ amount added on top of every number's base price. Editable here instead of
          MOTIVOLOGS_FLAT_MARKUP on the server.
        </p>

        {isLoadingMarkup ? (
          <Loader2 size={18} className="animate-spin text-gray-400" />
        ) : (
          <form onSubmit={handleSaveMarkup} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Markup (₦)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={markupInput}
                onChange={(e) => setMarkupInput(e.target.value)}
                className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-customGreen focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSavingMarkup}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                isSavingMarkup ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
              }`}
            >
              {isSavingMarkup ? <Loader2 size={16} className="animate-spin" /> : markupSaved ? <Check size={16} /> : null}
              {isSavingMarkup ? 'Saving...' : markupSaved ? 'Saved' : 'Save'}
            </button>
            <span className="text-xs text-gray-400">
              {markup?.isOverridden
                ? `Custom value — env default is ₦${markup.envDefault.toLocaleString()}`
                : `Using env default (MOTIVOLOGS_FLAT_MARKUP = ₦${markup?.envDefault.toLocaleString()})`}
            </span>
          </form>
        )}

        {markupError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{markupError}</p>}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-customGreenDark">Operator Mappings</h2>
        <p className="mt-1 mb-5 text-sm text-gray-500">
          Override the 5sim operator used for a specific service + country — useful when one operator has a better
          success rate than the default for that combination. Anything not listed here keeps using
          MOTIVOLOGS_FIVESIM_OPERATOR.
        </p>

        <form onSubmit={handleSave} className="mb-6 flex flex-wrap items-end gap-3">
          <div className="w-48">
            <label className="mb-1 block text-xs font-medium text-gray-600">Country</label>
            <Select
              options={countries}
              value={countries.find((c) => c.value === form.country) || null}
              onChange={(option) => setForm((f) => ({ ...f, country: option ? option.value : '' }))}
              getOptionValue={(o) => o.value}
              formatOptionLabel={(o) => <CountryOptionLabel iso={o.iso} label={o.label} />}
              isLoading={isLoadingCountries}
              isClearable
              isSearchable
              placeholder={isLoadingCountries ? 'Loading...' : 'Search country...'}
              noOptionsMessage={() => 'No matching countries'}
              unstyled
              classNames={selectClassNames}
            />
          </div>

          <div className="w-48">
            <label className="mb-1 block text-xs font-medium text-gray-600">Service</label>
            <Select
              options={services}
              value={services.find((s) => s.value === form.service) || null}
              onChange={(option) => setForm((f) => ({ ...f, service: option ? option.value : '' }))}
              getOptionValue={(o) => o.value}
              isLoading={isLoadingServices}
              isDisabled={!form.country || isLoadingServices}
              isClearable
              isSearchable
              placeholder={!form.country ? 'Pick a country first' : isLoadingServices ? 'Loading...' : 'Search service...'}
              noOptionsMessage={() => 'No services available'}
              unstyled
              classNames={selectClassNames}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Operator</label>
            <input
              value={form.operator}
              onChange={updateOperator}
              placeholder="virtual28"
              className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-customGreen focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              isSaving ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
            }`}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Save
          </button>
        </form>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-125 text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2">Operator</th>
                <th className="px-3 py-2">Updated</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-gray-400">
                    <Loader2 size={18} className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : mappings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-gray-400">
                    No overrides yet — every service + country uses the default operator.
                  </td>
                </tr>
              ) : (
                mappings.map((m) => (
                  <tr key={m._id} className="border-b border-gray-100">
                    <td className="px-3 py-3 font-medium text-gray-900 capitalize">{m.service}</td>
                    <td className="px-3 py-3 text-gray-700 capitalize">{m.country}</td>
                    <td className="px-3 py-3 font-mono text-xs text-gray-600">{m.operator}</td>
                    <td className="px-3 py-3 text-gray-500">{new Date(m.updatedAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => handleDelete(m._id)}
                        disabled={deletingId === m._id}
                        className="cursor-pointer text-gray-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Delete mapping for ${m.service} in ${m.country}`}
                      >
                        <Trash2 size={16} />
                      </button>
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

export default AdminOperatorMappings
