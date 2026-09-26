import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../../auth/AuthLayout'
import TextField from '../../auth/TextField'
import adminApi from '../../../lib/adminApi'

// TEMPORARY — remove this page (and its route + the backend's
// /api/admin/register endpoint) once your admin account(s) exist.
const AdminRegister = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await adminApi.post('/admin/register', { name, email, password })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="Admin account created">
        <div className="text-center">
          <CheckCircle2 className="mx-auto mb-3 text-customGreen" size={40} />
          <p className="mb-6 text-sm text-gray-600">You can now log in with this admin account.</p>
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full cursor-pointer rounded-xl bg-customGreen py-3 font-semibold text-white hover:bg-customGreenDark"
          >
            Continue to Login
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Register Admin" subtitle="Create an admin account for the Motivo Logs panel">
      <form onSubmit={handleSubmit}>
        <TextField label="Name" icon={User} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
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
          placeholder="At least 8 characters"
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

        <TextField
          label="Confirm Password"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
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
          {isSubmitting ? 'Creating account...' : 'Create Admin Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an admin account?{' '}
        <Link to="/admin/login" className="font-semibold text-customGreen hover:text-customGreenDark">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default AdminRegister
