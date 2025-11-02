import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'

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

  // UI state for accessibility & interface level (visual-only, no persistence required)
  const [highContrast, setHighContrast] = useState(false)
  const [largeFonts, setLargeFonts] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [uiLevel, setUiLevel] = useState(1)
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
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-medium mb-3">Accessibility Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div>
                <div className="font-medium">High Contrast</div>
                <div className="text-sm text-muted-foreground">Enhanced visibility</div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(v => !v)} className="hidden" />
                <span className={`w-10 h-6 rounded-full p-0.5 flex items-center ${highContrast ? 'bg-primary' : 'bg-border'}`}>
                  <span className={`bg-white w-4 h-4 rounded-full shadow transform ${highContrast ? 'translate-x-4' : ''}`}></span>
                </span>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div>
                <div className="font-medium">Large Fonts</div>
                <div className="text-sm text-muted-foreground">Easier reading</div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={largeFonts} onChange={() => setLargeFonts(v => !v)} className="hidden" />
                <span className={`w-10 h-6 rounded-full p-0.5 flex items-center ${largeFonts ? 'bg-primary' : 'bg-border'}`}>
                  <span className={`bg-white w-4 h-4 rounded-full shadow transform ${largeFonts ? 'translate-x-4' : ''}`}></span>
                </span>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div>
                <div className="font-medium">Screen Reader</div>
                <div className="text-sm text-muted-foreground">Audio assistance</div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={screenReader} onChange={() => setScreenReader(v => !v)} className="hidden" />
                <span className={`w-10 h-6 rounded-full p-0.5 flex items-center ${screenReader ? 'bg-primary' : 'bg-border'}`}>
                  <span className={`bg-white w-4 h-4 rounded-full shadow transform ${screenReader ? 'translate-x-4' : ''}`}></span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Interface level */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Choose Your Interface Level</h3>
          <div className="flex gap-4 mb-4">
            <button className={`flex-1 p-4 rounded-lg border ${uiLevel===1 ? 'bg-primary/5 border-primary' : 'bg-background border-border'}`} onClick={() => setUiLevel(1)}>
              <div className="text-center font-medium">Level 1</div>
              <div className="text-xs text-muted-foreground text-center">Beginner</div>
            </button>
            <button className={`flex-1 p-4 rounded-lg border ${uiLevel===2 ? 'bg-primary/5 border-primary' : 'bg-background border-border'}`} onClick={() => setUiLevel(2)}>
              <div className="text-center font-medium">Level 2</div>
              <div className="text-xs text-muted-foreground text-center">Standard</div>
            </button>
            <button className={`flex-1 p-4 rounded-lg border ${uiLevel===3 ? 'bg-primary/5 border-primary' : 'bg-background border-border'}`} onClick={() => setUiLevel(3)}>
              <div className="text-center font-medium">Level 3</div>
              <div className="text-xs text-muted-foreground text-center">Advanced</div>
            </button>
          </div>

          <div className="p-6 bg-card border border-border rounded-2xl">
            <h4 className="font-semibold">Level {uiLevel}: {uiLevel===1? 'Beginner Mode': uiLevel===2? 'Standard Mode' : 'Advanced Mode'}</h4>
            <p className="text-sm text-muted-foreground mt-2">{uiLevel===1 ? 'Large buttons, emoji icons, minimal options. Perfect for first-time users and seniors.' : uiLevel===2 ? 'Balanced layout with quick actions and insights.' : 'More options and compact layout for power users.'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Send Money */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Send Money</h2>

              <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar">
                {contacts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`flex-none min-w-36 sm:min-w-40 text-left p-3 rounded-lg border ${selected.id === c.id ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'} transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${c.color}`}>{c.name.split(' ').map(s => s[0]).slice(0,2).join('')}</div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-muted-foreground">{c.upi}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <form onSubmit={onPayClick} className="flex flex-col md:flex-row md:items-end gap-3">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full mt-1 px-4 py-3 rounded-lg border border-border bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="w-full md:w-48">
                  <label className="text-sm text-muted-foreground">Category</label>
                  <select value={payCategory} onChange={e => setPayCategory(e.target.value)} className="w-full mt-1 px-3 py-3 rounded-lg border border-border bg-transparent outline-none">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg bg-primary text-white font-medium shadow-sm w-full md:w-auto"
                  disabled={status === 'processing'}
                >
                  {status === 'processing' ? 'Processing...' : 'Pay'}
                </button>
              </form>
            </div>

            {/* After success: summary card list */}
            <div className="mt-6 space-y-4">
              {history.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Recent Payments</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {categories.map(cat => (
                          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-xs px-2 py-1 rounded-full ${selectedCategory===cat ? 'bg-primary text-white' : 'bg-background border border-border'}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  <div className="space-y-3">
                      {history.filter(h => selectedCategory === 'All' || h.category === selectedCategory).map(h => (
                        <div key={h.id} className="flex items-center justify-between p-3 rounded-md border border-border">
                          <div>
                            <div className="font-medium">{h.to} <span className="text-sm text-muted-foreground">• {h.upi}</span></div>
                            <div className="text-sm text-muted-foreground">{formatDate(h.date)}</div>
                            <div className="text-xs text-muted-foreground mt-1">Category: {h.category || 'Other'}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{h.amount}</div>
                            <button onClick={() => onRepeat(h)} className="text-sm text-primary mt-1 hover:underline">Repeat</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Insights + friendly card */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="mb-4">
                <h4 className="text-sm text-muted-foreground mb-1">Available Balance</h4>
                <div className={`text-2xl font-semibold ${balance < 10000 ? 'text-red-500' : balance < 50000 ? 'text-yellow-500' : 'text-green-500'}`}>
                  ₹{balance.toLocaleString('en-IN')}
                </div>
                {balance < 10000 && (
                  <p className="text-xs text-red-500 mt-1">Low balance warning!</p>
                )}
              </div>
              <div className="mb-4">
                <h4 className="text-sm text-muted-foreground mb-1">Weekly Spend</h4>
                <div className="text-2xl font-semibold">₹{weeklySpend}</div>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground mb-3">Top Categories</h4>
                <div className="flex flex-col gap-2">
                  {topCategories.length > 0 ? (
                    topCategories.map((cat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                        <span className="text-sm font-medium">{cat.category}</span>
                        <span className="text-sm text-muted-foreground">{cat.percentage}%</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No transactions yet</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="text-4xl">👋</div>
                <h3 className="text-xl font-semibold mt-2">Namaste!</h3>
                <p className="text-sm text-muted-foreground mt-2">What would you like to do?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border bg-background/50 hover:bg-background hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-2xl">✨</div>
                  <div className="font-medium text-sm">Pay Bills</div>
                  <div className="text-xs text-muted-foreground">बिल भरें</div>
                </button>
                
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border bg-background/50 hover:bg-background hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-2xl">🧮</div>
                  <div className="font-medium text-sm">Recharge</div>
                  <div className="text-xs text-muted-foreground">रिचार्ज करें</div>
                </button>
                
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border bg-background/50 hover:bg-background hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-2xl">🏛️</div>
                  <div className="font-medium text-sm">Bank Statement</div>
                  <div className="text-xs text-muted-foreground">खाता विवरण</div>
                </button>
                
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border bg-background/50 hover:bg-background hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-2xl">🔒</div>
                  <div className="font-medium text-sm">Card Lock</div>
                  <div className="text-xs text-muted-foreground">कार्ड लॉक</div>
                </button>
              </div>
            </div>
          </div>
        </div>
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
