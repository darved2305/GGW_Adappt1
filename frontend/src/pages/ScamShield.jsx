import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import ScamDetectionDemo from "@/components/ScamDetectionDemo"
import ScamEducation from "@/components/ScamEducation"
import ScamStats from "@/components/ScamStats"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, BookOpen, Volume2 } from "lucide-react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"

export default function ScamShieldPage() {
  const [textToSpeech, setTextToSpeech] = useState(false)
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [hindiMode, setHindiMode] = useState(false)

  return (
    <div className={`min-h-screen ${dyslexiaFont ? 'font-mono' : ''}`}>
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-hero">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
                <Shield className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">ScamShield Protection</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {hindiMode ? (
                  <>स्कैम से <span className="gradient-primary bg-clip-text text-transparent">बचाव</span></>
                ) : (
                  <>Stay Safe from <span className="gradient-primary bg-clip-text text-transparent">Scams</span></>
                )}
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {hindiMode ? (
                  <>
                    रियल-टाइम स्कैम डिटेक्शन और एजुकेशन से अपने आप को सुरक्षित रखें।
                    <span className="block mt-2 font-semibold text-foreground">हम आपकी हर लेनदेन की रक्षा करते हैं।</span>
                  </>
                ) : (
                  <>
                    Real-time scam detection and education to keep you safe. Learn to identify fraud before it happens.
                    <span className="block mt-2 font-semibold text-foreground">हम आपकी हर लेनदेन की रक्षा करते हैं।</span>
                  </>
                )}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <FeaturePill icon={<Shield />} text={hindiMode ? "24/7 सुरक्षा" : "24/7 Protection"} />
                <FeaturePill icon={<AlertTriangle />} text={hindiMode ? "रियल-टाइम अलर्ट" : "Real-time Alerts"} />
                <FeaturePill icon={<BookOpen />} text={hindiMode ? "स्कैम शिक्षा" : "Scam Education"} />
              </div>

              {/* Accessibility Controls */}
              <Card className="inline-flex items-center gap-6 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Text-to-Speech</span>
                  <Switch checked={textToSpeech} onCheckedChange={setTextToSpeech} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Dyslexia Font</span>
                  <Switch checked={dyslexiaFont} onCheckedChange={setDyslexiaFont} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">हिंदी / English</span>
                  <Switch checked={hindiMode} onCheckedChange={setHindiMode} />
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Stats Overview removed as requested */}

        {/* Interactive Demo */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <ScamDetectionDemo hindiMode={hindiMode} textToSpeech={textToSpeech} />
          </div>
        </section>

        {/* Educational Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <ScamEducation hindiMode={hindiMode} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeaturePill({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
      <div className="text-destructive">{icon}</div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}

