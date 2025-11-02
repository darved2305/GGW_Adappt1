import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Type, Volume2, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

// PayInsights — enhanced layout with accessibility toggles and improved animation
export default function PayInsights() {
  const contacts = [
    { id: 'c1', name: 'Asha Patel', upi: 'asha@upi', color: 'bg-rose-400', category: 'Person' },
    { id: 'c2', name: 'Rohit Kumar', upi: 'rohit@upi', color: 'bg-emerald-400', category: 'Person' },
    { id: 'c3', name: 'Nina Roy', upi: 'nina@upi', color: 'bg-indigo-400', category: 'Person' },
    { id: 'c4', name: 'Grocery Store', upi: 'grocery@upi', color: 'bg-yellow-400', category: 'Groceries' },
    { id: 'c5', name: 'Market', upi: 'market@upi', color: 'bg-emerald-300', category: 'Market' },
    { id: 'c6', name: 'Cafe', upi: 'cafe@upi', color: 'bg-indigo-300', category: 'Cafe' },
  ]

  const [selected, setSelected] = useState(contacts[0])
  const [amount, setAmount] = useState('500')
  const [status, setStatus] = useState('idle') // idle | processing | success
  const [showOverlay, setShowOverlay] = useState(false)
  // seed with some recent transactions so Weekly Spend shows initial value
  const initialHistory = [
    { id: 'h1', to: 'Grocery Store', upi: 'grocery@upi', amount: 3200, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), category: 'Groceries' },
    { id: 'h2', to: 'Market', upi: 'market@upi', amount: 1800, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), category: 'Market' },
    { id: 'h3', to: 'Cafe', upi: 'cafe@upi', amount: 1420, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), category: 'Cafe' },
  ]

  const [history, setHistory] = useState(initialHistory)
  const [balance, setBalance] = useState(250000) // Initial balance ₹2,50,000

  // UI state for accessibility and interface level
  const [highContrast, setHighContrast] = useState(false)
  const [largeFonts, setLargeFonts] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [uiLevel, setUiLevel] = useState(1) // 1, 2, or 3
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Groceries', 'Market', 'Cafe', 'Utilities', 'Rent', 'Bills']
  const [payCategory, setPayCategory] = useState('Groceries')

  const svgTickRef = useRef(null)

  const doPay = (payTo = selected, payAmount = amount) => {
    if (!payAmount || Number(payAmount) <= 0) return
    // Check if sufficient balance
    if (Number(payAmount) > balance) {
      alert('Insufficient balance!')
      return
    }
    setStatus('processing')
    setShowOverlay(true)

    // Better staged animation: ring expand -> fill -> tick
    // 1) processing (ring/pulse) ~1.6s
    // 2) fill transition -> show tick (~0.9s)
    // 3) success visible for 1.5s then dismiss
    setTimeout(() => {
      setStatus('success')
      // animate SVG tick stroke if present
      try {
        const path = svgTickRef.current
        if (path) {
          path.style.strokeDasharray = path.getTotalLength()
          path.style.strokeDashoffset = path.getTotalLength()
          // force reflow
          // eslint-disable-next-line no-unused-expressions
          path.getBoundingClientRect()
          path.style.transition = 'stroke-dashoffset 420ms ease-out'
          path.style.strokeDashoffset = '0'
        }
      } catch (e) {}

      setTimeout(() => {
        // add to history
        const tx = {
          id: Date.now().toString(),
          to: payTo.name,
          upi: payTo.upi,
            amount: Number(payAmount),
            category: payCategory || payTo.category || 'Other',
          date: new Date(),
        }
        setHistory(prev => [tx, ...prev])
        // Deduct from balance
        setBalance(prev => prev - Number(payAmount))
        setShowOverlay(false)
        // reset status after overlay dismissed
        setTimeout(() => setStatus('idle'), 300)
      }, 1500)
    }, 1600 + Math.random() * 500)
  }

  const onPayClick = (e) => {
    e.preventDefault()
    doPay()
  }

  const onRepeat = (tx) => {
    setSelected(contacts.find(c => c.name === tx.to) || contacts[0])
    setAmount(String(tx.amount))
    setPayCategory(tx.category || 'Groceries')
    setTimeout(() => doPay(contacts.find(c => c.name === tx.to), String(tx.amount)), 120)
  }

  const formatDate = (d) => {
    try {
      return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    } catch (e) {
      return d.toString()
    }
  }

  // compute weekly spend (sum of transactions in last 7 days), respecting category filter
  const weeklySpend = React.useMemo(() => {
    try {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      return history.reduce((sum, tx) => {
        const t = typeof tx.date === 'string' ? new Date(tx.date) : tx.date
        const inWeek = t && t.getTime() >= weekAgo
        const matchesCategory = selectedCategory === 'All' || (tx.category === selectedCategory)
        return (inWeek && matchesCategory) ? sum + Number(tx.amount || 0) : sum
      }, 0)
    } catch (e) {
      return history.reduce((s, tx) => s + Number(tx.amount || 0), 0)
    }
  }, [history, selectedCategory])

  // compute top categories with percentages
  const topCategories = React.useMemo(() => {
    try {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      const categoryTotals = {}
      let grandTotal = 0

      history.forEach(tx => {
        const t = typeof tx.date === 'string' ? new Date(tx.date) : tx.date
        if (t && t.getTime() >= weekAgo) {
          const cat = tx.category || 'Other'
          const amt = Number(tx.amount || 0)
          categoryTotals[cat] = (categoryTotals[cat] || 0) + amt
          grandTotal += amt
        }
      })

      return Object.entries(categoryTotals)
        .map(([cat, total]) => ({
          category: cat,
          total,
          percentage: grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0
        }))
        .sort((a, b) => b.total - a.total)
    } catch (e) {
      return []
    }
  }, [history])

  return (
  <div className={`min-h-screen p-6 md:p-10 pt-24 md:pt-36 ${highContrast ? 'filter contrast-125' : ''} ${largeFonts ? 'text-lg' : ''}`}>
      <style>{`
        /* Improved payment animation styles */
        .pi-overlay { background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); }
        .pi-center { width: 140px; height: 140px; display:flex; align-items:center; justify-content:center; }
        .pi-ring { position:absolute; width:180px; height:180px; border-radius:50%; }
        .pi-ring .dot { position:absolute; inset:0; border-radius:50%; box-shadow: 0 0 0 6px rgba(59,130,246,0.12); animation: ringExpand 1.2s ease-out forwards; }
        @keyframes ringExpand { 0% { transform: scale(0.7); opacity: 0.9 } 60% { transform: scale(1.2); opacity: 0.28 } 100% { transform: scale(1.6); opacity: 0 } }
        .pi-core { width:120px; height:120px; border-radius:50%; background: linear-gradient(180deg,#fff,#f8fafc); display:flex; align-items:center; justify-content:center; box-shadow: 0 10px 30px rgba(2,6,23,0.2); }
        .pi-core.processing { transform: scale(0.98); animation: corePulse 360ms ease-in-out infinite alternate; }
        @keyframes corePulse { to { transform: scale(1.03) } }
        .pi-core.success { background: linear-gradient(180deg,#10b981,#059669); color: white; }
        .tick-svg { width: 60px; height: 60px; }
      `}</style>

      <Navigation />
      <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Pay & Insights</h1>
          <Link to="/home" className="text-sm text-muted-foreground hover:underline">Back to home</Link>
        </div>

        {/* Accessibility settings */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="text-xl font-bold mb-4">Accessibility Settings</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">High Contrast</p>
                  <p className="text-xs text-muted-foreground">Enhanced visibility</p>
                </div>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Large Fonts</p>
                  <p className="text-xs text-muted-foreground">Easier reading</p>
                </div>
              </div>
              <Switch checked={largeFonts} onCheckedChange={setLargeFonts} />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Screen Reader</p>
                  <p className="text-xs text-muted-foreground">Audio assistance</p>
                </div>
              </div>
              <Switch checked={screenReader} onCheckedChange={setScreenReader} />
            </div>
          </div>
        </Card>

        {/* Interface Level Selector */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Choose Your Interface Level</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setUiLevel(1)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  uiLevel === 1
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Level 1</div>
                  <Badge variant="secondary" className="text-xs mt-1">Beginner</Badge>
                </div>
              </button>
              <button
                onClick={() => setUiLevel(2)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  uiLevel === 2
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Level 2</div>
                  <Badge variant="secondary" className="text-xs mt-1">Standard</Badge>
                </div>
              </button>
              <button
                onClick={() => setUiLevel(3)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  uiLevel === 3
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Level 3</div>
                  <Badge variant="secondary" className="text-xs mt-1">Advanced</Badge>
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* Content based on UI Level */}
        {uiLevel === 1 ? (
          /* Level 1: Beginner - Large buttons, simple layout */
          <div className="space-y-6">
            <Card className={`p-8 ${highContrast ? 'bg-black border-2 border-white' : 'bg-gradient-to-br from-primary/5 to-secondary/5'}`}>
              <div className="text-center mb-8">
                <div className={`text-5xl mb-4 ${largeFonts ? 'text-6xl' : ''}`}>👋</div>
                <h2 className={`font-bold mb-2 ${largeFonts ? 'text-3xl' : 'text-2xl'} ${highContrast ? 'text-white' : ''}`}>Namaste!</h2>
                <p className={`${largeFonts ? 'text-xl' : 'text-lg'} ${highContrast ? 'text-gray-300' : 'text-muted-foreground'}`}>Send money easily</p>
              </div>

              {/* Large Contact Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {contacts.slice(0, 4).map(c => (
                  <motion.button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selected.id === c.id
                        ? highContrast ? 'border-white bg-white text-black' : 'border-primary bg-primary/10'
                        : highContrast ? 'border-white/50 bg-black' : 'border-border bg-card hover:border-primary/50'
                    } ${largeFonts ? 'min-h-[140px]' : 'min-h-[120px]'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3 ${c.color} ${largeFonts ? 'w-20 h-20' : ''}`}>
                      <span className={largeFonts ? 'text-2xl' : 'text-xl'}>{c.name.split(' ').map(s => s[0]).slice(0,2).join('')}</span>
                    </div>
                    <div className={`font-bold ${largeFonts ? 'text-lg' : 'text-base'} ${highContrast ? 'text-white' : ''}`}>{c.name}</div>
                    <div className={`text-xs mt-1 ${highContrast ? 'text-gray-300' : 'text-muted-foreground'}`}>{c.upi}</div>
                  </motion.button>
                ))}
              </div>

              {/* Large Amount Input */}
              <div className="mb-6">
                <label className={`block mb-2 ${largeFonts ? 'text-lg' : 'text-base'} ${highContrast ? 'text-white' : ''}`}>Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className={`w-full ${largeFonts ? 'px-6 py-5 text-xl' : 'px-4 py-4 text-lg'} rounded-xl border-2 border-border bg-background outline-none focus:ring-4 focus:ring-primary/20 ${highContrast ? 'border-white' : ''}`}
                />
              </div>

              {/* Large Pay Button */}
              <Button
                onClick={onPayClick}
                disabled={status === 'processing'}
                className={`w-full ${largeFonts ? 'py-6 text-xl' : 'py-5 text-lg'} rounded-xl ${
                  highContrast
                    ? 'bg-white text-black hover:bg-gray-200 border-2 border-white'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                }`}
              >
                {status === 'processing' ? 'Processing...' : '💸 Send Money'}
              </Button>
            </Card>
          </div>
        ) : uiLevel === 2 ? (
          /* Level 2: Standard - Balanced layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card className="p-6 shadow-sm">
                <h2 className={`${largeFonts ? 'text-xl' : 'text-lg'} font-medium mb-4 ${highContrast ? 'text-white' : ''}`}>Send Money</h2>

                <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar">
                  {contacts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`flex-none min-w-36 sm:min-w-40 text-left p-3 rounded-lg border transition-colors ${
                        selected.id === c.id
                          ? 'border-primary bg-primary/5'
                          : highContrast ? 'border-white/50 hover:border-white' : 'border-transparent hover:border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${c.color}`}>
                          {c.name.split(' ').map(s => s[0]).slice(0,2).join('')}
                        </div>
                        <div>
                          <div className={`font-medium ${highContrast ? 'text-white' : ''}`}>{c.name}</div>
                          <div className={`text-sm ${highContrast ? 'text-gray-300' : 'text-muted-foreground'}`}>{c.upi}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <form onSubmit={onPayClick} className="flex flex-col md:flex-row md:items-end gap-3">
                  <div className="flex-1">
                    <label className={`text-sm ${highContrast ? 'text-white' : 'text-muted-foreground'}`}>Amount (₹)</label>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className={`w-full mt-1 px-4 py-3 rounded-lg border border-border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${highContrast ? 'border-white text-white' : ''}`}
                    />
                  </div>

                  <div className="w-full md:w-48">
                    <label className={`text-sm ${highContrast ? 'text-white' : 'text-muted-foreground'}`}>Category</label>
                    <select
                      value={payCategory}
                      onChange={e => setPayCategory(e.target.value)}
                      className={`w-full mt-1 px-3 py-3 rounded-lg border border-border bg-transparent outline-none ${highContrast ? 'border-white text-white' : ''}`}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === 'processing'}
                    className={`${highContrast ? 'bg-white text-black hover:bg-gray-200 border-2 border-white' : ''}`}
                  >
                    {status === 'processing' ? 'Processing...' : 'Pay'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        ) : (
          /* Level 3: Advanced - Full featured, compact */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card className="p-6 shadow-sm">
                <h2 className={`${largeFonts ? 'text-xl' : 'text-lg'} font-medium mb-4 ${highContrast ? 'text-white' : ''}`}>Send Money</h2>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {contacts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selected.id === c.id
                          ? 'border-primary bg-primary/5'
                          : highContrast ? 'border-white/50 hover:border-white' : 'border-transparent hover:border-border'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2 ${c.color}`}>
                        {c.name.split(' ').map(s => s[0]).slice(0,2).join('')}
                      </div>
                      <div className={`text-xs font-medium truncate ${highContrast ? 'text-white' : ''}`}>{c.name}</div>
                    </button>
                  ))}
                </div>

                <form onSubmit={onPayClick} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs ${highContrast ? 'text-white' : 'text-muted-foreground'}`}>Amount (₹)</label>
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className={`w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${highContrast ? 'border-white text-white' : ''}`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs ${highContrast ? 'text-white' : 'text-muted-foreground'}`}>Category</label>
                      <select
                        value={payCategory}
                        onChange={e => setPayCategory(e.target.value)}
                        className={`w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-transparent outline-none ${highContrast ? 'border-white text-white' : ''}`}
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === 'processing'}
                    className={`w-full ${highContrast ? 'bg-white text-black hover:bg-gray-200 border-2 border-white' : ''}`}
                  >
                    {status === 'processing' ? 'Processing...' : 'Pay'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        )}

        {/* Balance, Recent Payments & Actions - Different layouts per level */}
        {uiLevel === 1 ? (
          /* Level 1: Simple balance + basic actions */
          <div className="grid grid-cols-1 gap-6 mt-6">
            <Card className={`p-8 ${highContrast ? 'bg-black border-2 border-white' : ''}`}>
              <div className="text-center mb-6">
                <h3 className={`${largeFonts ? 'text-xl' : 'text-lg'} ${highContrast ? 'text-white' : 'text-muted-foreground'} mb-2`}>Available Balance</h3>
                <div className={`${largeFonts ? 'text-5xl' : 'text-4xl'} font-bold ${balance < 10000 ? 'text-red-500' : balance < 50000 ? 'text-yellow-500' : 'text-green-500'}`}>
                  ₹{balance.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { emoji: '✨', label: 'Pay Bills', sublabel: 'बिल भरें' },
                  { emoji: '🧮', label: 'Recharge', sublabel: 'रिचार्ज करें' },
                  { emoji: '🏛️', label: 'Statement', sublabel: 'खाता विवरण' },
                  { emoji: '🔒', label: 'Card Lock', sublabel: 'कार्ड लॉक' },
                ].map((action, idx) => (
                  <Button
                    key={idx}
                    className={`${largeFonts ? 'py-6 text-lg' : 'py-5'} rounded-xl ${
                      highContrast
                        ? 'bg-white text-black hover:bg-gray-200 border-2 border-white'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                    }`}
                  >
                    <span className="text-3xl mr-2">{action.emoji}</span>
                    <div className="text-left">
                      <div className="font-bold">{action.label}</div>
                      <div className="text-xs opacity-90">{action.sublabel}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        ) : uiLevel === 2 ? (
          /* Level 2: Standard layout with balance, insights, and recent payments */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left: Recent Payments */}
            {history.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${largeFonts ? 'text-lg' : 'text-base'} font-medium ${highContrast ? 'text-white' : ''}`}>Recent Payments</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {categories.slice(0, 4).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${
                          selectedCategory === cat
                            ? 'bg-primary text-white'
                            : highContrast ? 'bg-white/20 text-white border border-white/50' : 'bg-background border border-border'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {history.filter(h => selectedCategory === 'All' || h.category === selectedCategory).slice(0, 5).map(h => (
                    <Card key={h.id} className={`p-3 ${highContrast ? 'bg-white border-2 border-white' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highContrast ? 'bg-black' : 'bg-muted'}`}>
                          <span className="text-lg">{
                            h.category === 'Groceries' ? '🛒' : h.category === 'Market' ? '🏪' : h.category === 'Cafe' ? '☕' : '💸'
                          }</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${largeFonts ? 'text-base' : 'text-sm'} ${highContrast ? 'text-black' : ''}`}>
                            {h.to}
                          </div>
                          <div className={`text-xs ${highContrast ? 'text-gray-700' : 'text-muted-foreground'}`}>
                            {formatDate(h.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${largeFonts ? 'text-base' : 'text-sm'} ${highContrast ? 'text-black' : ''}`}>
                            ₹{h.amount}
                          </div>
                          <button
                            onClick={() => onRepeat(h)}
                            className={`text-xs mt-1 ${highContrast ? 'text-blue-700' : 'text-primary'} hover:underline`}
                          >
                            Repeat
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

             {/* Right: Balance & Insights */}
             <div className="space-y-6">
               <Card className={`p-6 ${highContrast ? 'bg-white border-2 border-white' : 'bg-card border-2 border-primary/10'}`}>
                 <div className="mb-4">
                   <h4 className={`${largeFonts ? 'text-base' : 'text-sm'} ${highContrast ? 'text-black' : 'text-muted-foreground'} mb-1`}>Available Balance</h4>
                   <div className={`${largeFonts ? 'text-4xl' : 'text-3xl'} font-bold mb-3 ${balance < 10000 ? 'text-red-500' : balance < 50000 ? 'text-yellow-500' : 'text-green-600'}`}>
                     ₹{balance.toLocaleString('en-IN')}
                   </div>
                   <Badge className={`${highContrast ? 'bg-black text-white' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                     Weekly: ₹{weeklySpend}
                   </Badge>
                 </div>
               </Card>

              <Card className={`p-6 ${highContrast ? 'bg-white border-2 border-white' : ''}`}>
                <h4 className={`${largeFonts ? 'text-base' : 'text-sm'} font-medium mb-3 ${highContrast ? 'text-black' : ''}`}>Top Categories</h4>
                <div className="space-y-2">
                  {topCategories.slice(0, 3).map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className={`${largeFonts ? 'text-sm' : 'text-xs'} ${highContrast ? 'text-black' : ''}`}>{cat.category}</span>
                      <span className={`${largeFonts ? 'text-sm' : 'text-xs'} ${highContrast ? 'text-gray-700' : 'text-muted-foreground'}`}>{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className={`p-6 ${highContrast ? 'bg-white border-2 border-white' : ''}`}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: '✨', label: 'Pay Bills', sublabel: 'बिल भरें' },
                    { emoji: '🧮', label: 'Recharge', sublabel: 'रिचार्ज करें' },
                    { emoji: '🏛️', label: 'Statement', sublabel: 'खाता विवरण' },
                    { emoji: '🔒', label: 'Card Lock', sublabel: 'कार्ड लॉक' },
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                        highContrast
                          ? 'border-white bg-black text-white hover:bg-white hover:text-black'
                          : 'border-border bg-background/50 hover:bg-background hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl">{action.emoji}</div>
                      <div className={`font-medium ${largeFonts ? 'text-sm' : 'text-xs'} ${highContrast ? '' : ''}`}>{action.label}</div>
                      <div className={`text-xs ${highContrast ? 'text-gray-300' : 'text-muted-foreground'}`}>{action.sublabel}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* Level 3: Advanced - Detailed analytics and compact layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left: Recent Transactions - Detailed */}
            <div className="lg:col-span-2">
              {history.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`${largeFonts ? 'text-lg' : 'text-base'} font-medium ${highContrast ? 'text-white' : ''}`}>Recent Transactions</h3>
                    <div className="flex items-center gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            selectedCategory === cat
                              ? 'bg-primary text-white'
                              : highContrast ? 'bg-white/20 text-white border border-white/50' : 'bg-background border border-border'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {history.filter(h => selectedCategory === 'All' || h.category === selectedCategory).map(h => (
                      <div
                        key={h.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          highContrast ? 'border-white bg-white' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highContrast ? 'bg-black' : 'bg-muted'}`}>
                            <span className="text-sm">{
                              h.category === 'Groceries' ? '🛒' : h.category === 'Market' ? '🏪' : h.category === 'Cafe' ? '☕' : '💸'
                            }</span>
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${highContrast ? 'text-black' : ''}`}>{h.to}</div>
                            <div className={`text-xs ${highContrast ? 'text-gray-700' : 'text-muted-foreground'}`}>
                              {h.category} • {formatDate(h.date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`font-bold text-sm ${highContrast ? 'text-black' : ''}`}>₹{h.amount}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRepeat(h)}
                            className={highContrast ? 'text-black hover:bg-gray-200' : ''}
                          >
                            Repeat
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

             {/* Right: Balance & Analytics */}
             <div className="space-y-4">
               <Card className={`p-4 ${highContrast ? 'bg-white border-2 border-white' : 'bg-card border-2 border-primary/10'}`}>
                 <div className="mb-2">
                   <p className={`text-xs ${highContrast ? 'text-black' : 'text-muted-foreground'} mb-1`}>Total Balance</p>
                   <h3 className={`${largeFonts ? 'text-3xl' : 'text-2xl'} font-bold mb-2 ${balance < 10000 ? 'text-red-500' : balance < 50000 ? 'text-yellow-500' : 'text-green-600'}`}>
                     ₹{balance.toLocaleString('en-IN')}
                   </h3>
                   <div className={`flex items-center gap-4 text-xs ${highContrast ? 'text-black' : 'text-muted-foreground'}`}>
                     <div>
                       <div>Weekly</div>
                       <div className="font-semibold">₹{weeklySpend}</div>
                     </div>
                   </div>
                 </div>
               </Card>

              <Card className={`p-4 ${highContrast ? 'bg-white border-2 border-white' : ''}`}>
                <h4 className={`text-xs font-medium mb-2 ${highContrast ? 'text-black' : ''}`}>Top Categories</h4>
                <div className="space-y-2">
                  {topCategories.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${highContrast ? 'text-black' : ''}`}>{cat.category}</span>
                        <span className={`text-xs ${highContrast ? 'text-gray-700' : 'text-muted-foreground'}`}>{cat.percentage}%</span>
                      </div>
                      <div className={`h-1 rounded-full ${highContrast ? 'bg-gray-300' : 'bg-muted'}`}>
                        <div
                          className={`h-full rounded-full bg-primary`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className={`p-4 ${highContrast ? 'bg-white border-2 border-white' : ''}`}>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { emoji: '✨', label: 'Bills' },
                    { emoji: '🧮', label: 'Recharge' },
                    { emoji: '🏛️', label: 'Statement' },
                    { emoji: '🔒', label: 'Lock' },
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                        highContrast
                          ? 'border-white bg-black text-white hover:bg-white hover:text-black'
                          : 'border-border bg-background/50 hover:bg-background hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xl">{action.emoji}</span>
                      <span className={`text-xs ${highContrast ? '' : ''}`}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for fake payment animation */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pi-overlay">
          <div className="flex flex-col items-center gap-4">
            <div className="relative pi-center">
              <div className="pi-ring absolute" aria-hidden>
                <div className="dot" />
              </div>
              <div className={`pi-core ${status === 'processing' ? 'processing' : status === 'success' ? 'success' : ''}`}>
                {status === 'processing' ? (
                  <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.12" />
                    <path d="M4 12a8 8 0 018-8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="tick-svg" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle cx="26" cy="26" r="25" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                    <path ref={svgTickRef} d="M14 27l6 6 18-18" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>

            <div className="text-center text-white">
              {status === 'processing' ? (
                <div className="text-lg font-medium">Processing payment</div>
              ) : (
                <div className="text-lg font-medium">Payment Successful</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
