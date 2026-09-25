import { useRef, useState } from 'react'
import { Globe, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const countries = ['United States', 'United Kingdom', 'Nigeria', 'Canada', 'Germany']
const services = ['Telegram', 'WhatsApp', 'Google', 'Facebook', 'Signal', 'Discord']

// Mock data — replace with real transaction history once the API is wired up.
const transactions = [
  { orderId: 'T5CTLFPZ', date: '8/1/2026, 8:34 PM', number: '3309215518', code: '', service: 'Telegram', status: 'Pending' },
  { orderId: 'CDXDLPSV', date: '8/1/2026, 11:46 PM', number: '7622687810', code: '31652', service: 'Telegram', status: 'Completed' },
  { orderId: 'RV5UQX8H', date: '8/16/2026, 1:13 PM', number: '8056511684', code: '', service: 'Telegram', status: 'Pending' },
  { orderId: 'SEZVEEHA', date: '8/16/2026, 1:19 PM', number: '9562074855', code: '', service: 'Telegram', status: 'Pending' },
  { orderId: 'RM1PMVP6', date: '8/16/2026, 1:24 PM', number: '5056540888', code: '720773', service: 'Signal', status: 'Completed' },
]

// const providers = ['Alcatraz', 'Hercules']

const SmsVerification = () => {
  // const [provider, setProvider] = useState(providers[0])
  const [country, setCountry] = useState(countries[0])
  const [service, setService] = useState('')
  const scrollRef = useRef(null)

  // const switchProvider = () => {
  //   const nextIndex = (providers.indexOf(provider) + 1) % providers.length
  //   setProvider(providers[nextIndex])
  // }

  const scrollTable = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 200, behavior: 'smooth' })
  }

  return (
    <div className="p-4 sm:p-6">

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold text-customBlueDark">SMS Verification</h2>

          <label className="mb-2 block text-sm font-medium text-gray-700">Select Country</label>
          <div className="relative mb-5">
            <Globe className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-300 py-3 pr-10 pl-10 text-gray-800 focus:border-customBlue focus:outline-none"
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <label className="mb-2 block text-sm font-medium text-gray-700">Select Service</label>
          <div className="relative mb-6">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-300 py-3 pr-10 pl-4 text-gray-800 focus:border-customBlue focus:outline-none"
            >
              <option value="">Select Service...</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <button
            disabled={!service}
            className={`w-full rounded-xl py-3.5 font-semibold text-white ${
              service ? 'cursor-pointer bg-customBlue hover:bg-customBlueDark' : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            Purchase
          </button>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold text-customBlueDark">Recent Transactions</h2>

          <div ref={scrollRef} className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                  <th className="px-3 py-2">Order ID</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Number</th>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Service</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.orderId} className="border-b border-gray-100">
                    <td className="px-3 py-3 font-bold text-gray-900">{t.orderId}</td>
                    <td className="px-3 py-3 text-gray-600">{t.date}</td>
                    <td className="px-3 py-3 text-gray-600">{t.number}</td>
                    <td className="px-3 py-3 text-gray-600">{t.code || '—'}</td>
                    <td className="px-3 py-3 text-gray-600">{t.service}</td>
                    <td className="px-3 py-3 text-gray-600">{t.status}</td>
                  </tr>
                ))}
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
