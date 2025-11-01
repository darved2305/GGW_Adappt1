import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorReporter from '@/components/ErrorReporter'
import VisualEditsMessenger from '@/visual-edits/VisualEditsMessenger'
import Home from './pages/Home'
import VoiceBanking from './pages/VoiceBanking'
import TrustScore from './pages/TrustScore'
import SimpleBanking from './pages/SimpleBanking'
import ScamShield from './pages/ScamShield'
import AnimatedGridPattern from './components/ui/animated-grid-pattern'

function App() {
  return (
    <BrowserRouter>
      <div className="antialiased relative">
        {/* Full-viewport decorative pattern (site-wide) — placed behind content to avoid overlap */}
        <AnimatedGridPattern
          className="pointer-events-none -z-10 text-gray-300/40 pattern-mask-content"
          numSquares={40}
          maxOpacity={0.06}
          duration={4}
          repeatDelay={1}
        />
        <ErrorReporter />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/voice-banking" element={<VoiceBanking />} />
          <Route path="/trust-score" element={<TrustScore />} />
          <Route path="/simple-banking" element={<SimpleBanking />} />
          <Route path="/scam-shield" element={<ScamShield />} />
        </Routes>
        <VisualEditsMessenger />
      </div>
    </BrowserRouter>
  )
}

export default App

