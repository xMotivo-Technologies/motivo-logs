import { Clock, Mail, ArrowUpRight } from 'lucide-react'
import { SiWhatsapp, SiTelegram } from 'react-icons/si'

const contactChannels = [

  {
    label: 'Telegram',
    subtitle: '@motivologs',
    Icon: SiTelegram,
    color: '#229ED9',
    href: 'https://t.me/motivologs',
  },
  {
    label: 'Email',
    subtitle: 'support@motivologs.com',
    Icon: Mail,
    color: '#16a34a',
    href: 'mailto:support@motivologs.com',
  },
]

const Support = () => {
  return (
    <div className="max-w-3xl p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Support</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Need help or have questions? Our support team is available to assist you with account access, orders,
        payments, and other services.
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-customGreenDark/15 bg-customGreenDark/5 p-4 dark:border-customGreenBright/15 dark:bg-customGreenBright/5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-customGreenDark text-white">
          <Clock size={20} />
        </div>
        <div>
          <div className="text-xs font-semibold tracking-wide text-customGreenDark uppercase dark:text-customGreenBright">Support Hours</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Mon–Fri, 9am–6pm</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {contactChannels.map(({ label, subtitle, Icon, color, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md dark:border-white/10 dark:bg-customDarkSurface dark:hover:bg-customDarkSurfaceHover"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                {label}
                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-400 dark:text-gray-600 dark:group-hover:text-gray-400" />
              </div>
              <div className="truncate text-sm text-gray-500 dark:text-gray-400">{subtitle}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Support
