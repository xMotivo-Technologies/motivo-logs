import { Link } from 'react-router-dom'
import { CheckCircle2, Landmark, Copy } from 'lucide-react'

const points = [
  'Dedicated virtual account, generated instantly',
  'Fund via bank transfer — no manual confirmation',
  '100% secure, bank-grade infrastructure',
  'Wallet balance updates in real time',
]

const WalletPromo = () => (
  <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        <span className="mb-3 inline-block text-xs font-semibold tracking-wide text-customGreen uppercase">Wallet Funding</span>
        <h2 className="header-txt text-3xl font-bold text-gray-900 sm:text-4xl">
          Fund Your Wallet <span className="text-customGreen">In Seconds</span>
        </h2>
        <p className="mt-4 max-w-md text-gray-600">
          Generate your own dedicated virtual account number and top up anytime — no waiting on manual approval.
        </p>

        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 size={18} className="shrink-0 text-customGreen" />
              {point}
            </li>
          ))}
        </ul>

        <Link
          to="/register"
          className="mt-8 inline-block rounded-xl bg-customGreen px-6 py-3 font-semibold text-white hover:bg-customGreenDark"
        >
          Fund Your Wallet
        </Link>
      </div>

 
    </div>
  </section>
)

export default WalletPromo
