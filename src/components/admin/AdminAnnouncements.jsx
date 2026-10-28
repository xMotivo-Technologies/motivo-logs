import { useEffect, useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import adminApi from '../../lib/adminApi'

const Toggle = ({ checked, onChange, label }) => (
  <div className="flex items-center gap-2.5">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-0 p-0.5 transition-colors ${
        checked ? 'justify-end bg-customGreen' : 'justify-start bg-gray-300'
      }`}
    >
      <span className="block h-5 w-5 rounded-full bg-white shadow transition-transform" />
    </button>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
)

const AdminAnnouncements = () => {
  const [announcement, setAnnouncement] = useState({ title: '', description: '', isEnabled: false })
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(true)
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false)
  const [announcementSaved, setAnnouncementSaved] = useState(false)
  const [announcementError, setAnnouncementError] = useState('')

  const [marquee, setMarquee] = useState({ text: '', isEnabled: false })
  const [isLoadingMarquee, setIsLoadingMarquee] = useState(true)
  const [isSavingMarquee, setIsSavingMarquee] = useState(false)
  const [marqueeSaved, setMarqueeSaved] = useState(false)
  const [marqueeError, setMarqueeError] = useState('')

  useEffect(() => {
    adminApi
      .get('/admin/announcement')
      .then(({ data }) => setAnnouncement(data.announcement))
      .catch(() => {})
      .finally(() => setIsLoadingAnnouncement(false))

    adminApi
      .get('/admin/marquee')
      .then(({ data }) => setMarquee(data.marquee))
      .catch(() => {})
      .finally(() => setIsLoadingMarquee(false))
  }, [])

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault()
    setAnnouncementError('')
    setAnnouncementSaved(false)
    setIsSavingAnnouncement(true)
    try {
      const { data } = await adminApi.put('/admin/announcement', announcement)
      setAnnouncement(data.announcement)
      setAnnouncementSaved(true)
      setTimeout(() => setAnnouncementSaved(false), 2000)
    } catch (err) {
      setAnnouncementError(err.message)
    } finally {
      setIsSavingAnnouncement(false)
    }
  }

  const handleSaveMarquee = async (e) => {
    e.preventDefault()
    setMarqueeError('')
    setMarqueeSaved(false)
    setIsSavingMarquee(true)
    try {
      const { data } = await adminApi.put('/admin/marquee', marquee)
      setMarquee(data.marquee)
      setMarqueeSaved(true)
      setTimeout(() => setMarqueeSaved(false), 2000)
    } catch (err) {
      setMarqueeError(err.message)
    } finally {
      setIsSavingMarquee(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-customGreenDark">Login Announcement</h2>
        <p className="mt-1 mb-5 text-sm text-gray-500">
          A popup shown to each user once, the first time they log in after you publish or edit it. Editing an
          already-published announcement makes it reappear for everyone, even users who already saw the old version.
        </p>

        {isLoadingAnnouncement ? (
          <Loader2 size={18} className="animate-spin text-gray-400" />
        ) : (
          <form onSubmit={handleSaveAnnouncement} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Title</label>
              <input
                value={announcement.title}
                onChange={(e) => setAnnouncement((a) => ({ ...a, title: e.target.value }))}
                placeholder="Scheduled Maintenance"
                className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-customGreen focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
              <textarea
                value={announcement.description}
                onChange={(e) => setAnnouncement((a) => ({ ...a, description: e.target.value }))}
                placeholder="We'll be down for 10 minutes tonight at 11pm WAT."
                rows={3}
                className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-customGreen focus:outline-none"
              />
            </div>

            <Toggle
              checked={announcement.isEnabled}
              onChange={(v) => setAnnouncement((a) => ({ ...a, isEnabled: v }))}
              label={announcement.isEnabled ? 'Enabled — showing to users' : 'Disabled — not showing'}
            />

            {announcementError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{announcementError}</p>
            )}

            <button
              type="submit"
              disabled={isSavingAnnouncement}
              className={`flex w-fit items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                isSavingAnnouncement ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
              }`}
            >
              {isSavingAnnouncement ? (
                <Loader2 size={16} className="animate-spin" />
              ) : announcementSaved ? (
                <Check size={16} />
              ) : null}
              {isSavingAnnouncement ? 'Saving...' : announcementSaved ? 'Saved' : 'Save'}
            </button>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-customGreenDark">Marquee Warning Banner</h2>
        <p className="mt-1 mb-5 text-sm text-gray-500">
          A scrolling warning banner shown on every page of the customer app while enabled.
        </p>

        {isLoadingMarquee ? (
          <Loader2 size={18} className="animate-spin text-gray-400" />
        ) : (
          <form onSubmit={handleSaveMarquee} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Warning Text</label>
              <input
                value={marquee.text}
                onChange={(e) => setMarquee((m) => ({ ...m, text: e.target.value }))}
                placeholder="Scheduled downtime tonight at 11pm WAT — purchases may be delayed."
                className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-customGreen focus:outline-none"
              />
            </div>

            <Toggle
              checked={marquee.isEnabled}
              onChange={(v) => setMarquee((m) => ({ ...m, isEnabled: v }))}
              label={marquee.isEnabled ? 'Enabled — showing to users' : 'Disabled — not showing'}
            />

            {marqueeError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{marqueeError}</p>}

            <button
              type="submit"
              disabled={isSavingMarquee}
              className={`flex w-fit items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                isSavingMarquee ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-customGreen hover:bg-customGreenDark'
              }`}
            >
              {isSavingMarquee ? <Loader2 size={16} className="animate-spin" /> : marqueeSaved ? <Check size={16} /> : null}
              {isSavingMarquee ? 'Saving...' : marqueeSaved ? 'Saved' : 'Save'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}

export default AdminAnnouncements
