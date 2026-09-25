import { Link } from 'react-router-dom'

const CtaBanner = () => (
  <section id="contact" className="bg-linear-to-br from-gray-900 to-customGreenDark py-20">
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <span className="mb-3 inline-block text-xs font-semibold tracking-wide text-white/70 uppercase">Start Today</span>
      <h2 className="header-txt mb-4 text-3xl font-bold text-white sm:text-4xl">
        Ready to Get <span className="text-customGreenBright">Verified?</span>
      </h2>
      <p className="mb-8 text-white/80">Join Motivo Logs today and get instant access to verification and wallet tools.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/register" className="rounded-xl bg-white px-6 py-3 font-semibold text-customGreenDark hover:bg-gray-100">
          Create Free Account
        </Link>
        <Link to="/login" className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
          Log In
        </Link>
      </div>
    </div>
  </section>
)

export default CtaBanner
