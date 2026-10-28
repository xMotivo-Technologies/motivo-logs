import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import api from '../lib/api'

const MarqueeBanner = () => {
  const [text, setText] = useState('')

  useEffect(() => {
    api
      .get('/marquee')
      .then(({ data }) => setText(data.marquee?.text || ''))
      .catch(() => setText(''))
  }, [])

  if (!text) return null

  return (
    <div className="overflow-hidden bg-amber-500 py-2 dark:bg-amber-600">
      <div className="animate-marquee flex w-max gap-16 whitespace-nowrap">
        {[0, 1].map((i) => (
          <span key={i} className="flex items-center gap-2 text-sm font-semibold text-white">
            <AlertTriangle size={14} className="shrink-0" />
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MarqueeBanner
