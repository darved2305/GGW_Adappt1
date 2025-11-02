import { useEffect, useState } from 'react'

export default function Preloader({ duration = 3800, onFinish = () => {} }) {
  const [progress, setProgress] = useState(0)
  const messages = [
    'Teaching your wallet to do yoga...',
    'Money listens when Dadi nods.',
    'We are whispering savings tips to your rupees...',
    'Calibrating guardian sensors. Almost there!'
  ]
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)
      if (elapsed < duration) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => onFinish(), 200)
      }
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, onFinish])

  useEffect(() => {
    // rotate messages evenly across duration
    const interval = Math.max(250, Math.floor(duration / messages.length))
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), interval)
    return () => clearInterval(id)
  }, [duration])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 p-6">
  <img src="/logo.png" alt="SahiPay logo" className="w-28 h-28 md:w-36 md:h-36 rounded-xl object-cover shadow-lg" onError={(e)=>{e.currentTarget.style.display='none'; const s = document.createElement('div'); s.className='text-xl font-semibold'; s.textContent='SahiPay'; e.currentTarget.parentNode.insertBefore(s, e.currentTarget.nextSibling)}} />

        <div className="text-center max-w-xl">
          <h2 className="text-2xl font-bold">SahiPay — The Financial Guardian</h2>
          <p className="mt-2 text-sm text-muted-foreground">{messages[msgIndex]}</p>
        </div>

        <div className="w-64 md:w-96 mt-4">
          <div className="h-3 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-emerald-400 to-sky-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-sm text-center">Loading... {progress}%</div>
        </div>
      </div>
    </div>
  )
}
