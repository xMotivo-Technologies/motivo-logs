import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

const categories = ['All', 'Messaging', 'Social']

// Sample pricing for illustration — real rates depend on country/provider.
const services = [
  { icon: "https://cdn-icons-png.flaticon.com/128/16166/16166110.png", name: 'Telegram Verification', price: 'From ₦2000', category: 'Messaging' },
  { icon: "https://cdn-icons-png.flaticon.com/128/16566/16566143.png", name: 'WhatsApp Verification', price: 'From ₦2000', category: 'Messaging' },
  { icon: "https://cdn-icons-png.flaticon.com/128/4401/4401438.png", name: 'Tinder Verification', price: 'From ₦1000', category: 'Social' },
  { icon: "https://cdn-icons-png.flaticon.com/128/2702/2702602.png", name: 'Google Verification', price: 'From ₦1000', category: 'Social' },
  { icon: "https://cdn-icons-png.flaticon.com/128/15047/15047435.png", name: 'Facebook Verification', price: 'From ₦1000', category: 'Social' },
]

const ServicesMarketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered = activeCategory === 'All' ? services : services.filter((s) => s.category === activeCategory)

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block text-xs font-semibold tracking-wide text-customGreenDark uppercase">Popular Services</span>
          <h2 className="header-txt text-3xl font-bold text-gray-900 sm:text-4xl">
            Verify On <span className="text-customGreen">Any Platform</span>
          </h2>
         
        </div>

        <div className="mb-8 flex justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium ${
                activeCategory === category ? 'bg-customGreen text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((service) => (
            <div key={service.name} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg ">
                <img src={service.icon} alt={service.name} className="h-full w-full object-contain" />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">{service.name}</h3>
              <p className="mb-4 text-sm text-gray-500">{service.price}</p>
              <Link
                to="/register"
                className="block rounded-lg bg-customGreen py-2 text-center text-sm font-semibold text-white hover:bg-customGreenDark"
              >
                Get Number
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/register"
            className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ServicesMarketplace
