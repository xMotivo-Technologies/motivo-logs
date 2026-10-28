import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import * as Flags from 'country-flag-icons/react/3x2'
import { SiWhatsapp, SiTelegram, SiSignal, SiSnapchat, SiNetflix } from 'react-icons/si'
import { Loader2, Smartphone, AlertTriangle, Info, SignalHigh } from 'lucide-react'
import api from '../lib/api'

const naira = (n) => `₦${(n ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Delivery rate is the strongest signal for picking an operator — color
// it so a bad choice is obvious at a glance, not just a plain number.
const rateStyle = (rate) => {
  if (rate >= 50) return 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
  if (rate >= 20) return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
  return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
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
  const navigate = useNavigate()

  const [countries, setCountries] = useState([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [country, setCountry] = useState('')

  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [service, setService] = useState('')

  const [operators, setOperators] = useState([])
  const [isLoadingOperators, setIsLoadingOperators] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState('')

  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')

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

  // Per-operator price/stock/delivery-rate for the selected service — lets
  // the customer pick exactly which operator's number to buy.
  useEffect(() => {
    setSelectedOperator('')
    setOperators([])
    if (!country || !service) return

    setIsLoadingOperators(true)
    api
      .get(`/operators/${country}/${service}`)
      .then(({ data }) => setOperators(data.operators || []))
      .catch(() => setOperators([]))
      .finally(() => setIsLoadingOperators(false))
  }, [country, service])

  // On success, hand off to the order's own dedicated page
  // (/sms-verification/:orderId) — that's where the live waiting-for-code
  // view, countdown, and finish/cancel actions now live.
  const handlePurchase = async () => {
    setPurchaseError('')
    setIsPurchasing(true)
    try {
      const { data } = await api.post('/buy/activation', {
        country,
        product: service,
        operator: selectedOperator,
      })
      navigate(`/sms-verification/${data.order.id}`)
    } catch (err) {
      setPurchaseError(err.message)
    } finally {
      setIsPurchasing(false)
    }
  }

  const selectedOperatorData = operators.find((o) => o.operator === selectedOperator)
  const insufficientBalance = Boolean(selectedOperatorData) && selectedOperatorData.cost > balance

  return (
    <div className="max-w-xl p-4 sm:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-customDarkSurface">
        <h2 className="mb-5 text-xl font-semibold text-customGreen dark:text-customGreenBright">SMS Verification</h2>

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

        {service && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Operator
            </label>

            {isLoadingOperators ? (
              <div className="flex items-center gap-2 py-3 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                Loading operators...
              </div>
            ) : operators.length === 0 ? (
              <p className="py-3 text-sm text-gray-400 dark:text-gray-500">
                No operators currently in stock for this service.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {operators.map((o, index) => {
                  const isSelected = selectedOperator === o.operator
                  const isRecommended = index === 0
                  return (
                    <button
                      key={o.operator}
                      type="button"
                      onClick={() => setSelectedOperator(o.operator)}
                      className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-xl border px-4 py-3 text-left ${
                        isSelected
                          ? 'border-customGreen bg-customGreen/5 dark:border-customGreenBright dark:bg-customGreenBright/10'
                          : 'cursor-pointer border-gray-200 hover:border-gray-300 dark:border-white/10 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <SignalHigh
                          size={18}
                          className={`shrink-0 ${isSelected ? 'text-customGreen dark:text-customGreenBright' : 'text-gray-400'}`}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-gray-900 dark:text-white">{o.operator}</span>
                            {isRecommended && (
                              <span className="rounded-full bg-customBlue px-1.5 py-0.5 text-[9px]  whitespace-nowrap text-white">
                                Best Delivery
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{o.count.toLocaleString()} in stock</div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${rateStyle(o.rate)}`}>
                          {o.rate}% delivery
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{naira(o.cost)}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <div className="mb-4 flex items-start gap-2 rounded-lg bg-customBlueLight px-3 py-2 text-sm text-customBlueDark dark:bg-customBlue/10 dark:text-customBlue">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>
            Your IP address' country should be the same as the country of the phone number you bought. Be sure
            to use a proxy or VPN.
          </span>
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
          disabled={!selectedOperator || isPurchasing || insufficientBalance}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white ${
            selectedOperator && !isPurchasing && !insufficientBalance
              ? 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
              : 'cursor-not-allowed bg-gray-300 dark:bg-white/10'
          }`}
        >
          {isPurchasing && <Loader2 size={18} className="animate-spin" />}
          {isPurchasing
            ? 'Purchasing...'
            : selectedOperatorData
              ? `Pay - ${naira(selectedOperatorData.cost)}`
              : 'Pay'}
        </button>
      </section>
    </div>
  )
}

export default SmsVerification
