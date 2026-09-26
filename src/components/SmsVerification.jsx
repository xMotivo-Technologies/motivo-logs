import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import * as Flags from 'country-flag-icons/react/3x2'
import { SiWhatsapp, SiTelegram, SiSignal, SiSnapchat, SiNetflix } from 'react-icons/si'
import { ChevronLeft, ChevronRight, Loader2, Copy, Check, XCircle, CheckCircle2, Smartphone, AlertTriangle } from 'lucide-react'
import api from '../lib/api'

const ORDER_POLL_INTERVAL_MS = 5000

// 5sim names some countries differently from how users expect to search for them.
const COUNTRY_LABEL_OVERRIDES = { england: 'UK' }

// Quick-pick shortcuts shown above the service search — matched against the
// 5sim product key for the selected country (case-insensitive).
const POPULAR_SERVICES = [
  { value: 'whatsapp', label: 'WhatsApp', Icon: SiWhatsapp, color: '#25D366' },
  { value: 'telegram', label: 'Telegram', Icon: SiTelegram, color: '#229ED9' },
  { value: 'signal', label: 'Signal', Icon: SiSignal, color: '#5AC8FA' },
  { value: 'snapchat', label: 'Snapchat', Icon: SiSnapchat, color: '#FFFC00' },
  { value: 'netflix', label: 'Netflix', Icon: SiNetflix, color: '#E50914' },
]

const getServiceIcon = (value) => {
  const match = POPULAR_SERVICES.find((s) => s.value === value.toLowerCase())
  return match ? match.Icon : Smartphone
}

const getServiceIconColor = (value) => POPULAR_SERVICES.find((s) => s.value === value.toLowerCase())?.color

// Shared look for both the country and service comboboxes.
const selectClassNames = {
  control: () => 'w-full rounded-xl border border-gray-300 py-1.5 pl-2 pr-1 focus-within:border-customGreen',
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

const ServiceOptionLabel = ({ value, label, cost }) => {
  const Icon = getServiceIcon(value)
  const color = getServiceIconColor(value)
  return (
    <span className="flex w-full items-center justify-between gap-2">
      <span className="flex items-center gap-2 capitalize">
        <Icon size={16} className="shrink-0 text-gray-500" style={color ? { color } : undefined} />
        {label}
      </span>
      <span className="text-gray-400">₦{cost.toLocaleString()}</span>
    </span>
  )
}

const SmsVerification = () => {
  const [countries, setCountries] = useState([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [country, setCountry] = useState('')

  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [service, setService] = useState('')

  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [activeOrder, setActiveOrder] = useState(null)
  const [copied, setCopied] = useState(false)

  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)
  const [finishError, setFinishError] = useState('')
  // { type: 'completed' | 'cancelled' | 'expired', refunded, amount }
  const [orderOutcome, setOrderOutcome] = useState(null)

  const [transactions, setTransactions] = useState([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const scrollRef = useRef(null)

  const [balance, setBalance] = useState(0)

  useEffect(() => {
    api
      .get('/get-wallet-balance')
      .then(({ data }) => setBalance(data.balance))
      .catch(() => setBalance(0))
  }, [])

  // Country list from 5sim — loaded once.
  useEffect(() => {
    api
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

  // Services + live pricing for the selected country.
  useEffect(() => {
    setService('')
    setProducts([])
    if (!country) return

    setIsLoadingProducts(true)
    api
      .get(`/products/${country}`)
      .then(({ data }) => {
        const list = Object.entries(data.products || {})
          .filter(([, info]) => Number(info.Qty) > 0)
          .map(([value, info]) => ({ value, label: value, cost: info.cost }))
        list.sort((a, b) => a.label.localeCompare(b.label))
        setProducts(list)
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoadingProducts(false))
  }, [country])

  const loadTransactions = () => {
    setIsLoadingTransactions(true)
    api
      .get('/get-transactions')
      .then(({ data }) => {
        const relevant = (data.data || []).filter((t) =>
          ['5sim_activation', '5sim_activation_refund'].includes(t.meta?.service),
        )
        setTransactions(relevant)
      })
      .catch(() => setTransactions([]))
      .finally(() => setIsLoadingTransactions(false))
  }

  useEffect(loadTransactions, [])

  const refreshBalance = () => {
    api
      .get('/get-wallet-balance')
      .then(({ data }) => setBalance(data.balance))
      .catch(() => {})
  }

  // Marks the order finished on our side once its code has been received —
  // called automatically the moment a code shows up, and by the manual
  // "Finish Order" button as a fallback.
  const finishActiveOrder = async (orderId) => {
    setFinishError('')
    setIsFinishing(true)
    try {
      await api.post(`/order/${orderId}/finish`)
      setOrderOutcome({ type: 'completed' })
      setActiveOrder(null)
      loadTransactions()
    } catch (err) {
      setFinishError(err.message)
    } finally {
      setIsFinishing(false)
    }
  }

  // Poll the active order until an SMS code arrives, finishing it
  // automatically the moment it does — or picking up an automatic refund
  // if the backend notices it expired without ever receiving one.
  useEffect(() => {
    if (!activeOrder || activeOrder.sms?.length > 0) return

    const interval = setInterval(() => {
      api
        .get(`/order/${activeOrder.id}`)
        .then(({ data }) => {
          if (data.refunded) {
            setOrderOutcome({ type: 'expired', refunded: true, amount: data.refundedAmount })
            setActiveOrder(null)
            loadTransactions()
            refreshBalance()
            return
          }

          const codeJustArrived = !(activeOrder.sms?.length > 0) && data.order.sms?.length > 0
          setActiveOrder({ ...data.order, amount: activeOrder.amount })

          if (codeJustArrived) {
            finishActiveOrder(data.order.id)
          }
        })
        .catch(() => {})
    }, ORDER_POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [activeOrder])

  const handlePurchase = async () => {
    setPurchaseError('')
    setIsPurchasing(true)
    try {
      const { data } = await api.post('/buy/activation', { country, product: service })
      setActiveOrder({ ...data.order, amount: data.amount })
    } catch (err) {
      setPurchaseError(err.message)
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleCancelOrder = async () => {
    setCancelError('')
    setIsCancelling(true)
    try {
      const { data } = await api.post(`/order/${activeOrder.id}/cancel`)
      setOrderOutcome({ type: 'cancelled', refunded: data.refunded, amount: data.refundedAmount })
      setActiveOrder(null)
      loadTransactions()
      refreshBalance()
    } catch (err) {
      setCancelError(err.message)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleBackToPurchase = () => {
    setActiveOrder(null)
    setOrderOutcome(null)
    setCancelError('')
    setFinishError('')
  }

  const handleFinishOrder = () => finishActiveOrder(activeOrder.id)

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(activeOrder.phone)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access unavailable — nothing to do
    }
  }

  const scrollTable = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 200, behavior: 'smooth' })
  }

  const selectedProduct = products.find((p) => p.value === service)
  const smsCode = activeOrder?.sms?.[0]?.code
  const insufficientBalance = Boolean(selectedProduct) && selectedProduct.cost > balance

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold text-customGreen">SMS Verification</h2>

          {orderOutcome ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-3 text-customGreen" size={40} />
              <p className="mb-1 font-semibold text-gray-900">
                {orderOutcome.type === 'completed'
                  ? 'Order complete'
                  : orderOutcome.type === 'expired'
                    ? 'Order expired'
                    : 'Order cancelled'}
              </p>
              <p className="mb-6 text-sm text-gray-600">
                {orderOutcome.type === 'completed'
                  ? 'Your verification code was received successfully.'
                  : orderOutcome.refunded
                    ? `₦${orderOutcome.amount.toLocaleString()} has been refunded to your wallet.`
                    : 'No refund was issued for this order.'}
              </p>
              <button
                onClick={handleBackToPurchase}
                className="w-full cursor-pointer rounded-xl bg-customGreen py-3 font-semibold text-white hover:bg-customGreenDark"
              >
                Back to Purchase
              </button>
            </div>
          ) : activeOrder ? (
            <div>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Service</div>
                  <div className="font-semibold text-gray-900 capitalize">{activeOrder.product}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Amount</div>
                  <div className="font-semibold text-gray-900">₦{activeOrder.amount.toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Order ID</div>
                <div className="font-semibold text-gray-900">{activeOrder.id}</div>
              </div>

              <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Your Number</div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold tracking-wide text-gray-900">{activeOrder.phone}</span>
                  <button
                    onClick={handleCopyNumber}
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold text-customGreen hover:text-customGreenDark"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Verification Code</div>
                {smsCode ? (
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <CheckCircle2 size={18} className="text-customGreen" />
                    {smsCode}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 size={16} className="animate-spin" />
                    Waiting for code...
                  </div>
                )}
              </div>

              {cancelError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{cancelError}</p>
              )}
              {finishError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{finishError}</p>
              )}

              <div className="flex gap-3">
                {smsCode ? (
                  <button
                    onClick={handleFinishOrder}
                    disabled={isFinishing}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white ${
                      isFinishing ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
                    }`}
                  >
                    {isFinishing && <Loader2 size={18} className="animate-spin" />}
                    {isFinishing ? 'Finishing...' : 'Finish Order'}
                  </button>
                ) : (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-semibold ${
                      isCancelling
                        ? 'cursor-not-allowed border-gray-200 text-gray-400'
                        : 'cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isCancelling ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <label className="mb-2 block text-sm font-medium text-gray-700">Select Country</label>
              <div className="mb-5">
                <Select
                  options={countries}
                  value={countries.find((c) => c.value === country) || null}
                  onChange={(option) => setCountry(option ? option.value : '')}
                  getOptionValue={(o) => o.value}
                  formatOptionLabel={(o) => <CountryOptionLabel iso={o.iso} label={o.label} />}
                  isLoading={isLoadingCountries}
                  isClearable
                  isSearchable
                  placeholder={isLoadingCountries ? 'Loading countries...' : 'Search for a country...'}
                  noOptionsMessage={() => 'No matching countries'}
                  unstyled
                  classNames={selectClassNames}
                />
              </div>

              <label className="mb-2 block text-sm font-medium text-gray-700">Popular Services</label>
              <div className="mb-5 flex flex-wrap gap-2">
                {POPULAR_SERVICES.map(({ value, label, Icon, color }) => {
                  const match = products.find((p) => p.value.toLowerCase() === value)
                  const isActive = Boolean(match) && service === match.value

                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={!match}
                      onClick={() => match && setService(match.value)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
                        isActive
                          ? 'border-customGreen bg-customGreen text-white'
                          : match
                            ? 'cursor-pointer border-gray-300 text-gray-700 hover:border-customGreen hover:text-customGreen'
                            : 'cursor-not-allowed border-gray-200 text-gray-300 opacity-50'
                      }`}
                    >
                      <Icon size={14} style={{ color }} />
                      {label}
                    </button>
                  )
                })}
              </div>

              <label className="mb-2 block text-sm font-medium text-gray-700">Select Service</label>
              <div className="mb-6">
                <Select
                  options={products}
                  value={products.find((p) => p.value === service) || null}
                  onChange={(option) => setService(option ? option.value : '')}
                  getOptionValue={(o) => o.value}
                  formatOptionLabel={(o) => <ServiceOptionLabel value={o.value} label={o.label} cost={o.cost} />}
                  isLoading={isLoadingProducts}
                  isDisabled={!country || isLoadingProducts}
                  isClearable
                  isSearchable
                  placeholder={!country ? 'Select a country first' : isLoadingProducts ? 'Loading services...' : 'Search for a service...'}
                  noOptionsMessage={() => 'No services available'}
                  unstyled
                  classNames={selectClassNames}
                />
              </div>

              {insufficientBalance && (
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Balance too low to complete this order.{' '}
                    <Link to="/fund-wallet" className="font-semibold underline hover:text-red-700">
                      Fund Wallet
                    </Link>
                  </span>
                </div>
              )}

              {purchaseError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{purchaseError}</p>
              )}

              <button
                onClick={handlePurchase}
                disabled={!service || isPurchasing || insufficientBalance}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white ${
                  service && !isPurchasing && !insufficientBalance
                    ? 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
                    : 'cursor-not-allowed bg-gray-300'
                }`}
              >
                {isPurchasing && <Loader2 size={18} className="animate-spin" />}
                {isPurchasing
                  ? 'Purchasing...'
                  : selectedProduct
                    ? `Pay - ₦${selectedProduct.cost.toLocaleString()}`
                    : 'Pay'}
              </button>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold text-customGreen">Recent Transactions</h2>

          <div ref={scrollRef} className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                  <th className="px-3 py-2">Reference</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Country</th>
                  <th className="px-3 py-2">Service</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingTransactions ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                      <Loader2 size={16} className="mx-auto animate-spin" />
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                      No verification purchases yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t._id} className="border-b border-gray-100">
                      <td className="px-3 py-3 font-bold text-gray-900">{t.reference}</td>
                      <td className="px-3 py-3 text-gray-600">{new Date(t.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-3 text-gray-600 capitalize">{t.meta?.country || '—'}</td>
                      <td className="px-3 py-3 text-gray-600 capitalize">{t.meta?.product || '—'}</td>
                      <td className="px-3 py-3 text-gray-600">₦{t.amount.toLocaleString()}</td>
                      <td className="px-3 py-3 text-gray-600 capitalize">{t.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => scrollTable(-1)}
              className="cursor-pointer rounded-full border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollTable(1)}
              className="cursor-pointer rounded-full border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SmsVerification
