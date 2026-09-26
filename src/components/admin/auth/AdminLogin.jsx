import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthLayout from '../../auth/AuthLayout'
import TextField from '../../auth/TextField'
import adminApi from '../../../lib/adminApi'

const AdminLogin = ({ onSuccess }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      const { data } = await adminApi.post('/admin/login', { email, password })
      onSuccess(data.admin, data.accessToken)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Admin Login" subtitle="Sign in to the Motivo Logs admin panel">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          icon={Mail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@motivologs.com"
        />

        <TextField
          label="Password"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white ${
            isSubmitting ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
          }`}
        >
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Need an admin account?{' '}
        <Link to="/admin/register" className="font-semibold text-customGreen hover:text-customGreenDark">
          Register
        </Link>
      </p>
    </AuthLayout>
  )
}

export default AdminLogin
