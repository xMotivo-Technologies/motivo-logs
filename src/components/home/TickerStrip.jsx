const items = [
  'SMS Verification',
  'Virtual Numbers',
  'Instant Wallet Funding',
  '100% Secure',
  '24/7 Support',
  'Fast Delivery',
  'Nationwide Coverage',
]

// Duplicated once so the CSS animation loops seamlessly.
const content = [...items, ...items]

const TickerStrip = () => (
  <div className="overflow-hidden bg-customGreen py-2.5">
    <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
      {content.map((item, i) => (
        <span key={i} className="text-sm font-medium text-white/90">
          {item}
        </span>
      ))}
    </div>
  </div>
)

export default TickerStrip
