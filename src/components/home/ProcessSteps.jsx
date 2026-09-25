const steps = [
  { number: '01', title: 'Create Your Account', description: 'Sign up in seconds and verify your details.' },
  { number: '02', title: 'Fund Your Wallet', description: 'Generate a virtual account and fund it instantly.' },
  { number: '03', title: 'Start Verifying', description: 'Pick a service, get your number, receive your code.' },
]

const ProcessSteps = () => (
  <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
    <div className="mb-14 text-center">
      <span className="mb-3 inline-block text-xs font-semibold tracking-wide text-customBlueDark uppercase">Process</span>
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Get Started in <span className="text-customBlue">3 Simple Steps</span>
      </h2>
    </div>

    <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
      <div className="absolute top-6 right-0 left-0 hidden h-px bg-gray-200 sm:block" />
      {steps.map(({ number, title, description }) => (
        <div key={number} className="relative text-center">
          <div className="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-customBlue font-bold text-white">
            {number}
          </div>
          <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
          <p className="mx-auto max-w-xs text-sm text-gray-600">{description}</p>
        </div>
      ))}
    </div>
  </section>
)

export default ProcessSteps
