import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const BackToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-6 bottom-6 z-40 cursor-pointer rounded-full bg-customGreen p-3 text-white shadow-lg hover:bg-customBlueDark"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  )
}

export default BackToTop
