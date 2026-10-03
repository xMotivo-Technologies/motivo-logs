import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'How does SMS verification work?',
    answer:
      'Pick a country and service, purchase a virtual number, and use it wherever you need to verify. Your code shows up on the order page as soon as it arrives.',
  },
  {
    question: 'How do I fund my wallet?',
    answer:
      'Go to Fund Wallet and pay into your dedicated virtual account by bank transfer or card. Your balance updates automatically once the payment is confirmed.',
  },
  {
    question: "What happens if I don't receive a code?",
    answer:
      "You're only charged for numbers that actually work. If no code arrives before the order expires, cancel it and you'll be refunded to your wallet automatically.",
  },
  {
    question: 'Can I reuse a number for multiple verifications?',
    answer: 'No, every number is single-use and tied to one order. You\'ll need to purchase a new number for each verification.',
  },
  {
    question: 'How long do I have to receive a code?',
    answer:
      'Each number stays active for a limited window after purchase. If it expires before a code arrives, you\'re refunded automatically — no action needed on your part.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Head to the Support page to reach us on WhatsApp, Telegram, or email during our support hours.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="max-w-3xl p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Quick answers to common questions about verification, wallet funding, and refunds.
      </p>

      <div className="mt-5 flex flex-col gap-2.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div key={faq.question} className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-customDarkSurface">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                  <HelpCircle size={16} className="shrink-0 text-customGreenDark dark:text-customGreenBright" />
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-gray-400 transition-transform dark:text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && <p className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400">{faq.answer}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FAQ
