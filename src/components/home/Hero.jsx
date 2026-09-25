import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, Headphones, Globe2 } from 'lucide-react'

const badges = [
  { icon: Zap, label: 'Instant Delivery' },
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: Globe2, label: 'Nationwide Coverage' },
]

const Hero = () => {
  return (
    <section id="home" className="bg-customGreenDark">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 pb-0 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="header-txt mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black shadow-sm">
            #1 Digital Verification Platform
          </span>

          <h1 className="header-txt tracking-tighter text-5xl leading-tighter font-bold text-customGreenBright sm:text-7xl">
            No Number? 
            <br />
            <span className="text-white">No Wahala!</span>
          </h1>

          <p className="header-txt mt-5 max-w-md text-white">
           Purchase verification numbers for the services you use every day. Get your number, receive your OTP in just a few clicks.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-customGreenDark border-2 border-customGreenBright px-6 py-3 font-semibold text-white hover:bg-customGreenBright hover:text-customGreenDark"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {badges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-white">
                <Icon size={18} className="text-customGreenBright" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative  w-full overflow-hidden rounded-2xl sm:h-9 lg:h-105">
          <img
            src="images/hero-img.png"
            alt="Person verifying an account on their phone"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
