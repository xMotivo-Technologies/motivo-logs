import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'
import AuthLayout from './AuthLayout'
import TextField from './TextField'
import api from '../../lib/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError('Please enter your email')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await api.post('/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email">
        <div className="text-center">
          <CheckCircle2 className="mx-auto mb-3 text-customGreen dark:text-customGreenBright" size={40} />
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            If an account exists for <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>, a password reset
            link has been sent.
          </p>
          <Link
            to="/login"
            className="block w-full rounded-xl bg-customGreen py-3 text-center font-semibold text-white hover:bg-customGreenDark"
          >
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          icon={Mail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white ${
            isSubmitting ? 'cursor-not-allowed bg-gray-300 dark:bg-white/10' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
          }`}
        >
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-customGreen hover:text-customGreenDark dark:text-customGreenBright">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPassword
