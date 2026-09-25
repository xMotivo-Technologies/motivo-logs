import { Zap, ShieldCheck, Headphones, Tag } from 'lucide-react'

// Value props, not testimonials — no fabricated customer quotes here.
const points = [
  { icon: Zap, title: 'Instant Delivery', description: 'Numbers and codes arrive in seconds, not minutes.' },
  { icon: ShieldCheck, title: 'Bank-Grade Security', description: 'Your funds and data are protected end-to-end.' },
  { icon: Headphones, title: '24/7 Human Support', description: 'Real people on live chat whenever you need help.' },
  { icon: Tag, title: 'Transparent Pricing', description: 'No hidden fees — you see the price before you pay.' },
]

const WhyMotivoLogs = () => (
  <section className="bg-customGreenDark py-20">
    <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
      <span className="mb-3 inline-block text-xs font-semibold tracking-wide text-customGreenBright uppercase">Why Motivo Logs</span>
      <h2 className="header-txt mb-12 text-3xl font-bold text-white sm:text-4xl">Built To Be Trusted</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl bg-white/10 p-6 text-left">
            <Icon size={22} className="mb-3 text-white" />
            <h3 className="mb-1 font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/70">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default WhyMotivoLogs
