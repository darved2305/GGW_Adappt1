import { Button } from "@/components/ui/button"
import { Mic, Shield, Sparkles, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">India's First Voice-First Banking</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="block">Banking Karo</span>
            <span className="block gradient-primary bg-clip-text text-transparent">Bol Ke</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Voice-first banking in your language. Build trust, prevent scams, and bank with confidence.
            <span className="block mt-2 font-semibold text-foreground">सबके लिए। सबकी भाषा में।</span>
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <a href="/voice-banking">
              <Button
                size="lg"
                className="gradient-primary text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Mic className="mr-2 h-5 w-5" />
                Try "Bol ke Banking"
              </Button>
            </a>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2 cursor-pointer">
              Watch Demo
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-12"
          >
            <FeaturePill icon={<Mic />} text="Voice Commands" />
            <FeaturePill icon={<Shield />} text="Scam Protection" />
            <FeaturePill icon={<TrendingUp />} text="Build Credit" />
            <FeaturePill icon={<Sparkles />} text="AI Saathi" />
          </motion.div>
        </motion.div>

        {/* Floating Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-sm animate-float">
            <div className="aspect-[9/16] w-full max-w-[300px] mx-auto rounded-3xl bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl">
              <div className="w-full h-full bg-background rounded-3xl p-6 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center animate-pulse-glow">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Listening...</p>
                  <p className="text-lg font-semibold mt-1">"पैसे भेजो Rajesh को"</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturePill({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
      <div className="text-primary">{icon}</div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}

