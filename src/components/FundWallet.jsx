import { useState } from 'react'
import { Landmark, Copy, Check } from 'lucide-react'

// TODO: replace with real data from GET /api/get-virtual-account once auth is wired up.
// A 404 from that endpoint means the user has no account yet (hasAccount stays false);
// POST /api/create-virtual-account is what "Generate Virtual Account" should call.
const FundWallet = () => {
  const [hasAccount, setHasAccount] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const account = {
    bankName: 'Titan Paystack Bank',
    accountNumber: '9012345678',
    accountName: 'Index JS - Motivo Logs',
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasAccount(true)
    }, 1200)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access unavailable — nothing to do
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <section className="max-w-md rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold text-customBlueDark">Fund Wallet</h2>

        {!hasAccount ? (
          <>
            <p className="mb-6 text-sm text-gray-600">
              Generate a dedicated virtual account number to fund your wallet by bank transfer, anytime.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white ${
                isGenerating ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-customBlue hover:bg-customBlueDark'
              }`}
            >
              <Landmark size={18} />
              {isGenerating ? 'Generating...' : 'Generate Virtual Account'}
            </button>
          </>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-600">
              Transfer to this account anytime to fund your wallet instantly.
            </p>

            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Bank Name</div>
              <div className="font-semibold text-gray-900">{account.bankName}</div>
            </div>

            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Account Number</div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-wide text-gray-900">{account.accountNumber}</span>
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold text-customBlue hover:text-customBlueDark"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Account Name</div>
              <div className="font-semibold text-gray-900">{account.accountName}</div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default FundWallet
