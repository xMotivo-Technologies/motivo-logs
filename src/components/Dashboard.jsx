import { MessageCircle, MessageSquare, Mail, CreditCard, Eye, BadgeCheck, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const quickServices = [
  { link: '/sms-verification', title: 'SMS Verification', subtitle: 'Virtual phone numbers', icon: MessageSquare, color: 'bg-orange-500' },
  // { link: '/temp-email', title: 'Temp Email', subtitle: 'Quick verification codes', icon: Mail, color: 'bg-customBlue' },
  { link: '/support-chat', title: 'Support Chat', subtitle: 'Chat with support', icon: MessageCircle, color: 'bg-violet-500', online: true },
]

const Dashboard = ({ user }) => {
  return (
    <div className="max-w-3xl p-4 sm:p-6">
      <section className="rounded-2xl bg-customGreenDark p-6 text-white">
        <div className="mb-5 flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/25 text-lg font-semibold">
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-lg font-bold">
              {user.name} <BadgeCheck size={16} />
            </div>
            <div className="text-sm text-white/85">Welcome back!</div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-white/90">
            <CreditCard size={16} /> Balance <Eye size={16} />
          </div>
          <div className="text-3xl font-bold">₦{user.balance.toLocaleString()}</div>
        </div>

        
        <Link to="/fund-wallet" className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-customGreenBright py-3.5 font-semibold text-customGreenDark ">
          <Plus size={16} /> Deposit Funds
        </Link>
      </section>

      <h2 className="mt-6 mb-3.5 text-lg text-gray-900">Quick Services</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickServices.map((service) => {
          const Icon = service.icon
          return (
            <Link to={service.link}>
            <div
              key={service.title}
              className="relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 text-center hover:shadow-md"
            >
              {service.online && (
                <span className="absolute top-3 right-3 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                  ONLINE
                </span>
              )}
              <div className={`mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl ${service.color}`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="mb-1 font-semibold text-gray-900">{service.title}</div>
              <div className="text-sm text-gray-500">{service.subtitle}</div>
            </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
