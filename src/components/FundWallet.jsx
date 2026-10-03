import { useEffect, useRef, useState } from 'react'
import { Landmark, Copy, Check, Loader2 } from 'lucide-react'
import api from '../lib/api'

const POLL_INTERVAL_MS = 4000
const MAX_POLL_ATTEMPTS = 15 // ~1 minute

const mapAccount = (data) => ({
  bankName: data.dedicatedAccount?.bank?.name,
  accountNumber: data.dedicatedAccount?.account_number,
  accountName: data.dedicatedAccount?.account_name,
})

const FundWallet = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [copied, setCopied] = useState(false)
  const pollRef = useRef(null)

  useEffect(() => {
    api
      .get('/get-virtual-account')
      .then(({ data }) => setAccount(mapAccount(data)))
      .catch(() => setAccount(null))
      .finally(() => setIsLoading(false))

    return () => clearInterval(pollRef.current)
  }, [])

  // Paystack assigns the account asynchronously — it only lands in our DB once
  // their webhook fires, so we poll for it after kicking off the request.
  const pollForAccount = () => {
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts += 1
      try {
        const { data } = await api.get('/get-virtual-account')
        clearInterval(pollRef.current)
        setAccount(mapAccount(data))
        setIsGenerating(false)
      } catch {
        if (attempts >= MAX_POLL_ATTEMPTS) {
          clearInterval(pollRef.current)
          setIsGenerating(false)
          setGenerateError('This is taking longer than usual. Please refresh the page in a moment.')
        }
      }
    }, POLL_INTERVAL_MS)
  }

  const handleGenerate = async () => {
    setGenerateError('')
    setIsGenerating(true)
    try {
      await api.post('/create-virtual-account')
      pollForAccount()
    } catch (err) {
      setGenerateError(err.message)
      setIsGenerating(false)
    }
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
      <section className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-customDarkSurface">
        <h2 className="mb-5 text-xl font-semibold text-customGreenDark dark:text-white">Fund Wallet</h2>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            Checking your account...
          </div>
        ) : !account ? (
          <>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Generate a dedicated virtual account number to fund your wallet by bank transfer, anytime.
            </p>

            {generateError && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{generateError}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white ${
                isGenerating ? 'cursor-not-allowed bg-gray-300 dark:bg-white/10' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
              }`}
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Landmark size={18} />}
              {isGenerating ? 'Setting up your account...' : 'Generate Virtual Account'}
            </button>
          </>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
              Transfer to this account anytime to fund your wallet instantly.
            </p>

            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Bank Name</div>
              <div className="font-semibold text-gray-900 dark:text-white">{account.bankName}</div>
            </div>

            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Account Number</div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">{account.accountNumber}</span>
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold text-customGreen hover:text-customGreenDark dark:text-customGreenBright dark:hover:text-white"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Account Name</div>
              <div className="font-semibold text-gray-900 dark:text-white">{account.accountName}</div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default FundWallet
