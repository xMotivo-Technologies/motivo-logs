import { ShieldCheck, Wallet, Headphones } from 'lucide-react'

const solutions = [
  {
    icon: ShieldCheck,
    title: 'Account Verification',
    description: 'Pass phone verification on any platform instantly with a clean, dedicated number.',
  },
  {
    icon: Wallet,
    title: 'Wallet & Payments',
    description: 'Fund your wallet in seconds via a dedicated virtual account — no manual transfers to confirm.',
  },
  {
    icon: Headphones,
    title: 'Real Human Support',
    description: 'Live chat support whenever something needs sorting out, day or night.',
  },
]

const SolutionsGrid = () => (
  <section id="solutions" className="bg-customGreenDark py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-12 text-center">
        <span className="mb-3 inline-block text-xs font-semibold tracking-wide text-customGreenBright uppercase">Our Solutions</span>
        <h2 className="header-txt text-3xl font-bold text-white sm:text-4xl">
          Built For <span className="text-customGreenBright">Real-World Needs</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {solutions.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-customGreen bg-white p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-customGreenDark">
              <Icon size={22} className="text-customGreenBright" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default SolutionsGrid
