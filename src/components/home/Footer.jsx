import { BadgeCheck } from 'lucide-react'

const serviceLinks = ['SMS Verification', 'Fund Wallet', 'Temp Email (Soon)', 'Pay Utility Bills (Soon)']
// const companyLinks = ['About', 'FAQ', 'Support']

// lucide-react dropped brand/logo icons, so these three are small hand-drawn stand-ins.
const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...props}>
    <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.6.8-2.6 1a4 4 0 0 0-6.9 3.7A11.5 11.5 0 0 1 3.6 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4 4 0 0 1-1.8.1 4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.9c7.5 0 11.6-6.3 11.6-11.7v-.5c.8-.6 1.5-1.3 2.1-2.2Z" />
  </svg>
)

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...props}>
    <path d="M13.5 21v-7.5H16l.5-3H13.5V8.3c0-.9.2-1.5 1.5-1.5H16.5V4.2C16.2 4.1 15.2 4 14 4c-2.4 0-4 1.5-4 4.1v2.4H7.5v3H10V21h3.5Z" />
  </svg>
)

const Footer = () => (
  <footer className="bg-white pt-16 pb-8">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
      <div>
        <div className="mb-3 flex items-center gap-2">
          {/* <BadgeCheck className="text-customBlueDark" size={22} /> */}
          <img className='h-10' src="images/logo.png" alt="Motivo Logs Logo" />
          <span className="text-lg font-bold text-gray-900">Motivo Logs</span>
        </div>
        <p className="text-sm text-gray-500">Instant verification and wallet tools, built for speed and security.</p>
        <div className="mt-4 flex gap-3 text-gray-400">
          <TwitterIcon />
          <InstagramIcon />
          <FacebookIcon />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900">Services</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          {serviceLinks.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul>
      </div>

      {/* <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900">Company</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          {companyLinks.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul>
      </div> */}

      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900">Contact</h4>
        <p className="text-sm text-gray-500">support@motivologs.com</p>
      </div>
    </div>

    <div className="mx-auto mt-10 max-w-6xl border-t border-gray-100 px-4 pt-6 text-center text-xs text-gray-400 sm:px-6">
      © {new Date().getFullYear()} Motivo Logs by xMotivo Tech Ltd. All rights reserved.
    </div>
  </footer>
)

export default Footer
