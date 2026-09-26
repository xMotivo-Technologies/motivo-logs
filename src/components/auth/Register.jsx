import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, AtSign, Mail, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import AuthLayout from './AuthLayout'
import TextField from './TextField'
import api from '../../lib/api'

// Mirrors the validation rules enforced by POST /api/signup on the backend.
const USERNAME_REGEX = /^[a-z0-9_]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialForm = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
}

const validate = (form) => {
  if (Object.values(form).some((v) => !v.trim())) return 'All fields are required'
  if (form.username.trim().length < 3) return 'Username must be at least 3 characters'
  if (!USERNAME_REGEX.test(form.username.trim().toLowerCase())) {
    return 'Username can only contain lowercase letters, numbers, and underscores'
  }
  if (!EMAIL_REGEX.test(form.email.trim())) return 'Invalid email format'
  if (form.password.length < 8) return 'Password must be at least 8 characters'
  if (form.password !== form.confirmPassword) return 'Passwords do not match'
  return ''
}

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate(form)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await api.post('/signup', {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="Account created">
        <div className="text-center">
          <CheckCircle2 className="mx-auto mb-3 text-customGreen" size={40} />
          <p className="mb-6 text-sm text-gray-600">Your account has been created. You can now log in.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full cursor-pointer rounded-xl bg-customGreen py-3 font-semibold text-white hover:bg-customGreenDark"
          >
            Continue to Login
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join Motivo Logs in a few seconds">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="First Name" icon={User} value={form.firstName} onChange={updateField('firstName')} placeholder="John" />
          <TextField label="Last Name" icon={User} value={form.lastName} onChange={updateField('lastName')} placeholder="Doe" />
        </div>

        <TextField label="Username" icon={AtSign} value={form.username} onChange={updateField('username')} placeholder="johndoe" />
        <TextField label="Email" icon={Mail} type="email" value={form.email} onChange={updateField('email')} placeholder="you@example.com" />
        <TextField label="Phone Number" icon={Phone} value={form.phoneNumber} onChange={updateField('phoneNumber')} placeholder="08012345678" />

        <TextField
          label="Password"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={updateField('password')}
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
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
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
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-customGreen hover:text-customGreenDark">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Register
