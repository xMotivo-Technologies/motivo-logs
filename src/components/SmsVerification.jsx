import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import * as Flags from 'country-flag-icons/react/3x2'
import { SiWhatsapp, SiTelegram, SiSignal, SiSnapchat, SiNetflix } from 'react-icons/si'
import { Loader2, Copy, Check, XCircle, CheckCircle2, Smartphone, AlertTriangle } from 'lucide-react'
import api from '../lib/api'

const ORDER_POLL_INTERVAL_MS = 5000
const HISTORY_PAGE_SIZE = 20

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

// Two-note chime played the moment a code arrives — generated with the Web
// Audio API so no sound file needs to be shipped/loaded.
const playCodeReceivedSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const playTone = (freq, startTime, duration) => {
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = freq
      gain.gain.setValueAtTime(0.15, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }
    const now = ctx.currentTime
    playTone(880, now, 0.15)
    playTone(1175, now + 0.15, 0.2)
  } catch {
    // Web Audio unsupported/blocked — not critical, ignore.
  }
}

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
  control: () => 'w-full rounded-xl border border-gray-300 py-1.5 pl-2 pr-1 focus-within:border-customGreen dark:border-white/15 dark:bg-customDarkSurface',
  placeholder: () => 'pl-2 text-gray-400 dark:text-gray-500',
  input: () => 'pl-2 text-gray-800 dark:text-gray-100',
  singleValue: () => 'pl-2 w-full text-gray-800 dark:text-gray-100',
  menu: () => 'z-20 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-customDarkSurface',
  menuList: () => 'max-h-64 overflow-y-auto py-1',
  option: ({ isFocused, isSelected }) =>
    `cursor-pointer px-3 py-2 text-sm ${
      isSelected
        ? 'bg-gray-100 font-semibold text-customGreenDark dark:bg-white/10 dark:text-customGreenBright'
        : isFocused
          ? 'bg-gray-50 dark:bg-white/5'
          : 'text-gray-800 dark:text-gray-200'
    }`,
  noOptionsMessage: () => 'px-3 py-2 text-sm text-gray-400 dark:text-gray-500',
  dropdownIndicator: () => 'cursor-pointer pr-2 text-gray-400 dark:text-gray-500',
  clearIndicator: () => 'cursor-pointer pr-1 text-gray-400 dark:text-gray-500',
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

  const [orders, setOrders] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersPagination, setOrdersPagination] = useState(null)
  const [cancellingOrderId, setCancellingOrderId] = useState(null)

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

  const loadOrders = () => {
    setIsLoadingOrders(true)
    api
      .get('/orders', { params: { page: ordersPage, limit: HISTORY_PAGE_SIZE } })
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

  const refreshBalance = () => {
    api
      .get('/get-wallet-balance')
      .then(({ data }) => setBalance(data.balance))
      .catch(() => {})
  }

  // Marks the order finished on our side — only triggered by the user
  // clicking "Finish Order" once they've seen/copied their code, never
  // automatically, so the code stays visible until they're done with it.
  const finishActiveOrder = async (orderId) => {
    setFinishError('')
    setIsFinishing(true)
    try {
      await api.post(`/order/${orderId}/finish`)
      setOrderOutcome({ type: 'completed' })
      setActiveOrder(null)
      loadOrders()
    } catch (err) {
      setFinishError(err.message)
    } finally {
      setIsFinishing(false)
    }
  }

  // Resume any order still "pending" from a previous visit — otherwise
  // navigating away (or refreshing) before a code arrives or the order
  // expires would leave it untracked forever, with nothing left to notice
  // it needs finishing or refunding.
  useEffect(() => {
    api
      .get('/get-transactions')
      .then(({ data }) => {
        const pending = (data.data || []).find(
          (t) => t.status === 'pending' && t.meta?.service === '5sim_activation' && t.meta?.orderId,
        )
        if (!pending) return

        return api.get(`/order/${pending.meta.orderId}`).then(({ data }) => {
          if (data.refunded) {
            setOrderOutcome({ type: 'expired', refunded: true, amount: data.refundedAmount })
            loadOrders()
            refreshBalance()
            return
          }

          setActiveOrder({ ...data.order, amount: pending.amount })
        })
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Poll the active order until an SMS code arrives — stays on this same
  // order-details view once it does (code just appears here), rather than
  // jumping away. "Finish Order" is the only thing that ends the order.
  // Also picks up an automatic refund if the backend notices it expired
  // without ever receiving one.
  useEffect(() => {
    if (!activeOrder || activeOrder.sms?.length > 0) return

    const interval = setInterval(() => {
      api
        .get(`/order/${activeOrder.id}`)
        .then(({ data }) => {
          if (data.refunded) {
            setOrderOutcome({ type: 'expired', refunded: true, amount: data.refundedAmount })
            setActiveOrder(null)
            loadOrders()
            refreshBalance()
            return
          }

          const codeJustArrived = !(activeOrder.sms?.length > 0) && data.order.sms?.length > 0
          setActiveOrder({ ...data.order, amount: activeOrder.amount })

          if (codeJustArrived) {
            playCodeReceivedSound()
            loadOrders()
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
      loadOrders()
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
      loadOrders()
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

  const handleCancelHistoryOrder = async (orderId) => {
    setCancellingOrderId(orderId)
    try {
      await api.post(`/order/${orderId}/cancel`)
      loadOrders()
      refreshBalance()
      if (activeOrder?.id === orderId) {
        setActiveOrder(null)
      }
    } catch {
      // the row simply stays "pending" if this fails — keep it simple
    } finally {
      setCancellingOrderId(null)
    }
  }

  const selectedProduct = products.find((p) => p.value === service)
  const smsCode = activeOrder?.sms?.[0]?.code
  const insufficientBalance = Boolean(selectedProduct) && selectedProduct.cost > balance

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-customDarkSurface">
          <h2 className="mb-5 text-xl font-semibold text-customGreen dark:text-customGreenBright">SMS Verification</h2>

          {orderOutcome ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-3 text-customGreen dark:text-customGreenBright" size={40} />
              <p className="mb-1 font-semibold text-gray-900 dark:text-white">
                {orderOutcome.type === 'completed'
                  ? 'Order complete'
                  : orderOutcome.type === 'expired'
                    ? 'Order expired'
                    : 'Order cancelled'}
              </p>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                {orderOutcome.type === 'completed'
                  ? 'Your verification code was received successfully.'
                  : orderOutcome.refunded
                    ? `${naira(orderOutcome.amount)} has been refunded to your wallet.`
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
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Service</div>
                  <div className="font-semibold text-gray-900 capitalize dark:text-white">{activeOrder.product}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Amount</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{naira(activeOrder.amount)}</div>
                </div>
              </div>

              <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Order ID</div>
                <div className="font-semibold text-gray-900 dark:text-white">{activeOrder.id}</div>
              </div>

              <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Your Number</div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">{activeOrder.phone}</span>
                  <button
                    onClick={handleCopyNumber}
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold text-customGreen hover:text-customGreenDark dark:text-customGreenBright dark:hover:text-white"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Verification Code</div>
                {smsCode ? (
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <CheckCircle2 size={18} className="text-customGreen dark:text-customGreenBright" />
                    {smsCode}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    Waiting for code...
                  </div>
                )}
              </div>

              {cancelError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{cancelError}</p>
              )}
              {finishError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{finishError}</p>
              )}

              <div className="flex gap-3">
                {smsCode ? (
                  <button
                    onClick={handleFinishOrder}
                    disabled={isFinishing}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white ${
                      isFinishing ? 'cursor-not-allowed bg-gray-300 dark:bg-white/10' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
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
                        ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-white/10 dark:text-gray-600'
                        : 'cursor-pointer border-gray-300 text-customGreen hover:bg-customGreenDark hover:text-white dark:border-white/15 dark:text-customGreenBright'
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
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Select Country</label>
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

              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Popular Services</label>
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
                            ? 'cursor-pointer border-gray-300 text-gray-700 hover:border-customGreen hover:text-customGreen dark:border-white/15 dark:text-gray-300'
                            : 'cursor-not-allowed border-gray-200 text-gray-300 opacity-50 dark:border-white/10 dark:text-gray-600'
                      }`}
                    >
                      <Icon size={14} style={{ color }} />
                      {label}
                    </button>
                  )
                })}
              </div>

              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Select Service</label>
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
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Balance too low to complete this order.{' '}
                    <Link to="/fund-wallet" className="font-semibold underline hover:text-red-700 dark:hover:text-red-300">
                      Fund Wallet
                    </Link>
                  </span>
                </div>
              )}

              {purchaseError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{purchaseError}</p>
              )}

              <button
                onClick={handlePurchase}
                disabled={!service || isPurchasing || insufficientBalance}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white ${
                  service && !isPurchasing && !insufficientBalance
                    ? 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
                    : 'cursor-not-allowed bg-gray-300 dark:bg-white/10'
                }`}
              >
                {isPurchasing && <Loader2 size={18} className="animate-spin" />}
                {isPurchasing
                  ? 'Purchasing...'
                  : selectedProduct
                    ? `Pay - ${naira(selectedProduct.cost)}`
                    : 'Pay'}
              </button>
            </>
          )}
        </section>

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
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-200">{o.orderId}</td>
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
    </div>
  )
}

export default SmsVerification
