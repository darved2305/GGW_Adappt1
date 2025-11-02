import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import ErrorReporter from '@/components/ErrorReporter'
import VisualEditsMessenger from '@/visual-edits/VisualEditsMessenger'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import VoiceBanking from './pages/VoiceBanking'
import TrustScore from './pages/TrustScore'
import SimpleBanking from './pages/SimpleBanking'
import ScamShield from './pages/ScamShield'
import PayInsights from './pages/PayInsights'
import FinancialGuardian from './pages/FinancialGuardian'
import Dashboard from './pages/Dashboard'
import FinancialAdvisor from './pages/FinancialAdvisor'
import SmartSavings from './pages/SmartSavings'
import Preloader from './components/Preloader'
import AnimatedGridPattern from './components/ui/animated-grid-pattern'
import Wrapper from './pages/Wrapper'

function App() {
  const [showPreloader, setShowPreloader] = useState(true)
  return (
    <BrowserRouter>
      {showPreloader ? (
        <Preloader duration={3800} onFinish={() => setShowPreloader(false)} />
      ) : (
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
            <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Wrapper><Home /></Wrapper>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/voice-banking" element={<Wrapper><VoiceBanking /></Wrapper>} />
            <Route path="/trust-score" element={<Wrapper><TrustScore /></Wrapper>} />
            <Route path="/guardian" element={<Wrapper><FinancialGuardian /></Wrapper>} />
            <Route path="/simple-banking" element={<Wrapper><SimpleBanking /></Wrapper>} />
            <Route path="/scam-shield" element={<Wrapper><ScamShield /></Wrapper>} />
            <Route path="/voice-banking" element={<VoiceBanking />} />
            <Route path="/trust-score" element={<TrustScore />} />
            <Route path="/guardian" element={<FinancialGuardian />} />
            <Route path="/simple-banking" element={<SimpleBanking />} />
            <Route path="/pay-insights" element={<PayInsights />} />
            <Route path="/scam-shield" element={<ScamShield />} />
            <Route path="/financial-advisor" element={<Wrapper><FinancialAdvisor /></Wrapper>} />
            <Route path="/smart-savings" element={<Wrapper><SmartSavings /></Wrapper>} />
            <Route path="/dashboard" element={<Wrapper><Dashboard /></Wrapper>} />
          </Routes>
          <VisualEditsMessenger />
        </div>
      )}
    </BrowserRouter>
  )
}

export default App

