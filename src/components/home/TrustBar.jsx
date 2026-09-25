import { ShieldCheck, Zap, Headphones, RotateCcw, Globe2 } from 'lucide-react'

const items = [
  // { icon: ShieldCheck, label: 'Bank-Grade Security' },
  { icon: Zap, label: 'Instant Delivery' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: RotateCcw, label: 'Money-Back Guarantee' },
  { icon: Globe2, label: 'Global Coverage' },
]

const TrustBar = () => (
  <div className="border-b border-gray-100 bg-white py-4">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 sm:px-6">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <Icon size={15} className="text-customGreendark" />
          {label}
        </div>
      ))}
    </div>
  </div>
)

export default TrustBar
