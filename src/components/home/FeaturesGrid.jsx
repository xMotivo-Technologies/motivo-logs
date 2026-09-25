import { Link } from 'react-router-dom'
import { MessageSquare, Wallet, Mail, ArrowRight } from 'lucide-react'

const features = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'SMS Verification',
    description: 'Verified, secure phone numbers ready in seconds. Receive OTPs from every major platform.',
    cta: 'Explore Services',
    to: '/register',
  },
  {
    number: '02',
    icon: Wallet,
    title: 'Fund Wallet',
    description: 'Get a dedicated virtual account and fund your wallet instantly by bank transfer, anytime.',
    cta: 'Fund Wallet',
    to: '/register',
  }
]

const FeaturesGrid = () => (
  <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
    <div className="mb-12 text-center">
      <span className="mb-3 inline-block text-xs font-semibold tracking-wide text-customGreenDark uppercase">What We Offer</span>
      <h2 className="header-txt text-3xl font-bold text-gray-900 sm:text-4xl">
        Everything You Need, <span className="text-customGreen">In One Place</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-gray-600">
        A complete set of verification and wallet tools built for speed, security, and simplicity.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {features.map(({ number, icon: Icon, title, description, cta, to }) => (
        <div key={title} className="relative overflow-hidden rounded-2xl border border-gray-200 p-6">
          {/* <span className="absolute top-2 right-4 text-5xl font-bold text-gray-100">{number}</span> */}
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-customGreenDark">
            <Icon size={20} className="text-customGreenBright" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
          <p className="mb-4 text-sm text-gray-600">{description}</p>
          <Link to={to} className="flex items-center gap-1 text-sm font-semibold text-customGreen hover:underline">
            {cta} <ArrowRight size={14} />
          </Link>
        </div>
      ))}
    </div>
  </section>
)

export default FeaturesGrid
