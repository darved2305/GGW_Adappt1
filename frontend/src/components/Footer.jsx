import { Link } from "react-router-dom"
import { Mic, Shield, Layers, TrendingUp } from "lucide-react"

export default function Footer() {
  return (
  <footer className="bg-muted/80 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="SahiPay logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl object-cover" onError={(e)=>{e.currentTarget.style.display='none'; const s = document.createElement('span'); s.className='font-semibold ml-2'; s.textContent='SahiPay'; e.currentTarget.parentNode.appendChild(s)}} />
              <span className="sr-only">SahiPay</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Voice-first banking for everyone. सबके लिए। सबकी भाषा में।
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/voice-banking" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Mic className="w-4 h-4" /> Voice Banking
                </Link>
              </li>
              <li>
                <Link to="/trust-score" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Trust Score
                </Link>
              </li>
              <li>
                <Link to="/simple-banking" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Simple Banking
                </Link>
              </li>
              <li>
                <Link to="/scam-shield" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" /> ScamShield
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Press</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Security</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>Copyright @2025 - Made by Team GitGoneWild</p>
        </div>
      </div>
    </footer>
  )
}

