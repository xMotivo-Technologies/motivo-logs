import { useState } from 'react'
import { User, Mail, AtSign, Phone, Loader2, CheckCircle2 } from 'lucide-react'
import TextField from './auth/TextField'
import api from '../lib/api'

const Profile = ({ user, onUpdate }) => {
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!form.firstName.trim() || !form.lastName.trim() || !form.phoneNumber.trim()) {
      setError('First name, last name, and phone number are required')
      return
    }

    setIsSaving(true)
    try {
      const { data } = await api.patch('/me', form)
      onUpdate(data.user)
      setSuccess(true)
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({ firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber })
    setError('')
    setIsEditing(false)
  }

  return (
    <div className="p-4 sm:p-6">
      <section className="max-w-md rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3.5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-customGreenDark text-xl font-semibold text-white">
            {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">@{user.username}</div>
          </div>
        </div>

        {success && (
          <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
            <CheckCircle2 size={16} /> Profile updated successfully
          </p>
        )}
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="First Name"
              icon={User}
              value={form.firstName}
              onChange={updateField('firstName')}
              disabled={!isEditing}
            />
            <TextField
              label="Last Name"
              icon={User}
              value={form.lastName}
              onChange={updateField('lastName')}
              disabled={!isEditing}
            />
          </div>

          <TextField
            label="Phone Number"
            icon={Phone}
            value={form.phoneNumber}
            onChange={updateField('phoneNumber')}
            disabled={!isEditing}
          />

          <TextField label="Email" icon={Mail} value={user.email} disabled />
          <TextField label="Username" icon={AtSign} value={user.username} disabled />

          {isEditing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full cursor-pointer rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white ${
                  isSaving ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
                }`}
              >
                {isSaving && <Loader2 size={18} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full cursor-pointer rounded-xl bg-customGreen py-3 font-semibold text-white hover:bg-customGreenDark"
            >
              Edit Profile
            </button>
          )}
        </form>
      </section>
    </div>
  )
}

export default Profile
