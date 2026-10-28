import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import api from '../lib/api'

const AnnouncementModal = () => {
  const [announcement, setAnnouncement] = useState(null)
  const [isDismissing, setIsDismissing] = useState(false)

  useEffect(() => {
    api
      .get('/announcement')
      .then(({ data }) => setAnnouncement(data.announcement))
      .catch(() => setAnnouncement(null))
  }, [])

  const handleDismiss = async () => {
    setIsDismissing(true)
    try {
      await api.post('/announcement/seen')
    } catch {
      // if this fails the popup would just show again next load — fine
    } finally {
      setAnnouncement(null)
    }
  }

  if (!announcement) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-customDarkSurface">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-customGreenBright/20">
          <Megaphone size={22} className="text-customGreenDark dark:text-customGreenBright" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{announcement.title}</h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{announcement.description}</p>
        <button
          onClick={handleDismiss}
          disabled={isDismissing}
          className="w-full cursor-pointer rounded-xl bg-customGreen py-3 font-semibold text-white hover:bg-customGreenDark disabled:cursor-not-allowed disabled:opacity-60"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

export default AnnouncementModal
