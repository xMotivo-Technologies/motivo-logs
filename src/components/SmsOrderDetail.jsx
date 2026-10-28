import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2, Copy, Check, XCircle, CheckCircle2, Info, Timer, ArrowLeft } from 'lucide-react'
import api from '../lib/api'

const ORDER_POLL_INTERVAL_MS = 5000

const naira = (n) => `₦${(n ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatCountdown = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Two-note chime played the moment a code arrives — generated with the Web
// Audio API so no sound file needs to be shipped/loaded.
const playCodeReceivedSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const playTone = (freq, startTime, duration) => {
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = freq
      gain.gain.setValueAtTime(0.15, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }
    const now = ctx.currentTime
    playTone(880, now, 0.15)
    playTone(1175, now + 0.15, 0.2)
  } catch {
    // Web Audio unsupported/blocked — not critical, ignore.
  }
}

const SmsOrderDetail = () => {
  const { orderId } = useParams()

  const [order, setOrder] = useState(null)
  const [amount, setAmount] = useState(0)
  const [ownStatus, setOwnStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)
  const [finishError, setFinishError] = useState('')

  const fetchOrder = () =>
    api.get(`/order/${orderId}`).then(({ data }) => {
      setOrder(data.order)
      setAmount(data.amount)
      setOwnStatus(data.ownStatus)
      return data
    })

  useEffect(() => {
    setIsLoading(true)
    setLoadError('')
    fetchOrder()
      .catch((err) => setLoadError(err.message))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  // Poll while still pending and waiting on a code — stops once a code
  // arrives (same as before, just now keyed off the URL instead of local
  // purchase-flow state) or once the order resolves to a final status.
  useEffect(() => {
    if (ownStatus !== 'pending' || order?.sms?.length > 0) return

    const interval = setInterval(() => {
      const hadCode = order?.sms?.length > 0
      fetchOrder()
        .then((data) => {
          if (!hadCode && data.order.sms?.length > 0) {
            playCodeReceivedSound()
          }
        })
        .catch(() => {})
    }, ORDER_POLL_INTERVAL_MS)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownStatus, order?.sms?.length, orderId])

  // Live countdown to when the number actually expires on 5sim's side —
  // driven by the order's real `expires` timestamp, not a hardcoded 20m.
  useEffect(() => {
    if (ownStatus !== 'pending' || !order?.expires) {
      setTimeLeft(null)
      return
    }

    const expiresAt = new Date(order.expires).getTime()
    const tick = () => setTimeLeft(Math.max(0, Math.round((expiresAt - Date.now()) / 1000)))

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [order?.expires, ownStatus])

  const handleFinish = async () => {
    setFinishError('')
    setIsFinishing(true)
    try {
      await api.post(`/order/${orderId}/finish`)
      setOwnStatus('completed')
    } catch (err) {
      setFinishError(err.message)
    } finally {
      setIsFinishing(false)
    }
  }

  const handleCancel = async () => {
    setCancelError('')
    setIsCancelling(true)
    try {
      await api.post(`/order/${orderId}/cancel`)
      setOwnStatus('cancelled')
    } catch (err) {
      setCancelError(err.message)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.phone)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access unavailable — nothing to do
    }
  }

  const smsCode = order?.sms?.[0]?.code

  const BackLink = () => (
    <Link
      to="/sms-history"
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-customGreenDark dark:text-gray-400 dark:hover:text-customGreenBright"
    >
      <ArrowLeft size={16} /> Back to SMS History
    </Link>
  )

  if (isLoading) {
    return (
      <div className="max-w-xl p-4 sm:p-6">
        <BackLink />
        <section className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 dark:border-white/10 dark:bg-customDarkSurface">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </section>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="max-w-xl p-4 sm:p-6">
        <BackLink />
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-customDarkSurface">
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{loadError}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="max-w-xl p-4 sm:p-6">
      <BackLink />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-customDarkSurface">
        <h2 className="mb-5 text-xl font-semibold text-customGreen dark:text-customGreenBright">SMS Verification</h2>

        {ownStatus !== 'pending' ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-3 text-customGreen dark:text-customGreenBright" size={40} />
            <p className="mb-1 font-semibold text-gray-900 dark:text-white">
              {ownStatus === 'completed' ? 'Order complete' : ownStatus === 'expired' ? 'Order expired' : 'Order cancelled'}
            </p>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              {ownStatus === 'completed'
                ? 'Your verification code was received successfully.'
                : `${naira(amount)} has been refunded to your wallet.`}
            </p>
            {smsCode && (
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left dark:border-white/10 dark:bg-white/5">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Verification Code</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{smsCode}</div>
              </div>
            )}
            <Link
              to="/sms-verification"
              className="block w-full cursor-pointer rounded-xl bg-customGreen py-3 font-semibold text-white hover:bg-customGreenDark"
            >
              Buy Another Number
            </Link>
          </div>
        ) : (
          <div>
            {!smsCode && timeLeft != null && (
              <div
                className={`mb-3 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold ${
                  timeLeft === 0
                    ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                    : 'bg-customBlueLight text-customBlueDark dark:bg-customBlue/10 dark:text-customBlue'
                }`}
              >
                <Timer size={16} />
                {timeLeft === 0 ? 'Number expired' : `Expires in ${formatCountdown(timeLeft)}`}
              </div>
            )}

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Service</div>
                <div className="font-semibold text-gray-900 capitalize dark:text-white">{order.product}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Amount</div>
                <div className="font-semibold text-gray-900 dark:text-white">{naira(amount)}</div>
              </div>
            </div>

            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Order ID</div>
              <div className="font-semibold text-gray-900 dark:text-white">{order.id}</div>
            </div>

            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Your Number</div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">{order.phone}</span>
                <button
                  onClick={handleCopyNumber}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold text-customGreen hover:text-customGreenDark dark:text-customGreenBright dark:hover:text-white"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">Verification Code</div>
              {smsCode ? (
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <CheckCircle2 size={18} className="text-customGreen dark:text-customGreenBright" />
                  {smsCode}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  Waiting for code...
                </div>
              )}
            </div>

            {!smsCode && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-customBlueLight px-3 py-2 text-sm text-customBlueDark dark:bg-customBlue/10 dark:text-customBlue">
                <Info size={16} className="mt-0.5 shrink-0" />
                <span>
                  SMS not arriving? Try requesting the code again on the service, or cancel the order and try another
                  number.
                </span>
              </div>
            )}

            {cancelError && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{cancelError}</p>
            )}
            {finishError && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{finishError}</p>
            )}

            <div className="flex gap-3">
              {smsCode ? (
                <button
                  onClick={handleFinish}
                  disabled={isFinishing}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white ${
                    isFinishing ? 'cursor-not-allowed bg-gray-300 dark:bg-white/10' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
                  }`}
                >
                  {isFinishing && <Loader2 size={18} className="animate-spin" />}
                  {isFinishing ? 'Finishing...' : 'Finish Order'}
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-semibold ${
                    isCancelling
                      ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-white/10 dark:text-gray-600'
                      : 'cursor-pointer border-gray-300 text-customGreen hover:bg-customGreenDark hover:text-white dark:border-white/15 dark:text-customGreenBright'
                  }`}
                >
                  {isCancelling ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                  {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default SmsOrderDetail
