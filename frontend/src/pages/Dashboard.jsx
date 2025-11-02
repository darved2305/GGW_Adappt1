import React, { useState, useMemo, useRef } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { Cpu, Bolt, AlertTriangle, MessageSquare } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f77171', '#c7c7c7']

const mockCategories = [
  { name: 'Food', value: 4200 },
  { name: 'Transport', value: 2300 },
  { name: 'Bills', value: 1700 },
  { name: 'Entertainment', value: 900 },
  { name: 'Others', value: 600 },
]

const monthlyTrend = [
  { month: 'Apr', spend: 4200 },
  { month: 'May', spend: 3800 },
  { month: 'Jun', spend: 4500 },
  { month: 'Jul', spend: 4100 },
  { month: 'Aug', spend: 4800 },
  { month: 'Sep', spend: 5200 },
  { month: 'Oct', spend: 4700 },
]

const recentTx = [
  { id: 1, merchant: 'Cafe 24', category: 'Food', amount: 240, date: '2025-10-28' },
  { id: 2, merchant: 'City Transport', category: 'Transport', amount: 120, date: '2025-10-27' },
  { id: 3, merchant: 'Electricity Co', category: 'Bills', amount: 1600, date: '2025-10-25' },
  { id: 4, merchant: 'MoviePix', category: 'Entertainment', amount: 650, date: '2025-10-21' },
  { id: 5, merchant: 'Grocery Mart', category: 'Food', amount: 980, date: '2025-10-19' },
]

export default function Dashboard() {
  const [balance] = useState(12450)
  const [income] = useState(27000)
  const [expenses] = useState(15450)

  // chat widget state
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: 'Hi! I can help with budgets, transactions or insights.' },
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const [insightModalOpen, setInsightModalOpen] = useState(false)
  const [activeInsight, setActiveInsight] = useState(null)

  const sendMessage = (text) => {
    if (!text) return
    const userMsg = { id: Date.now(), from: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    // fake AI reply
    setTimeout(() => {
      const reply = sampleAiReply(text)
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'ai', text: reply }])
    }, 700)
  }

  const sampleAiReply = (q) => {
    const lq = q.toLowerCase()
    if (lq.includes('save') || lq.includes('save money')) return 'You can save ₹2,500 this month by reducing dining out and subscriptions.'
    if (lq.includes('unusual') || lq.includes('fraud')) return 'Unusual spending detected in Food category — ₹2,400 on Oct 19 at Grocery Mart.'
    if (lq.includes('budget')) return 'Your Food budget is at 82% of the target. Consider trimming snacks.'
    return 'Here are some suggestions: set a weekly budget, enable alerts for large spends, and review subscriptions.'
  }

  const topCategories = useMemo(() => {
    const total = mockCategories.reduce((s, c) => s + c.value, 0)
    return mockCategories.map((c, i) => ({ ...c, percent: Math.round((c.value / total) * 100), color: COLORS[i % COLORS.length] }))
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial Overview */}
          <section className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Total balance</h2>
                  <div className="mt-3 text-3xl font-bold">₹{balance.toLocaleString('en-IN')}</div>
                  <div className="text-sm text-muted-foreground mt-1">Available balance</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-muted-foreground">This month</div>
                  <div className="text-sm"><span className="font-medium text-green-600">+₹{(income - expenses).toLocaleString('en-IN')}</span> vs last month</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <Button variant="default" size="sm" onClick={() => alert('Send Money (demo)')}>Send Money</Button>
                <Button variant="outline" size="sm" onClick={() => alert('Add Money (demo)')}>Add Money</Button>
                <Button variant="ghost" size="sm" onClick={() => alert('Pay Bills (demo)')}>Pay Bills</Button>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Smart Insights</h3>
                <span className="text-xs text-muted-foreground">Personalized</span>
              </div>

              <div className="mt-4 space-y-3">
                {[{
                  icon: <Cpu className="w-5 h-5 text-primary" />,
                  title: 'Save this month',
                  desc: 'You can save ₹2,500 this month',
                  cta: 'Show tips'
                },{
                  icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
                  title: 'Unusual spending',
                  desc: 'Unusual spending detected in Food category',
                  cta: 'Review'
                },{
                  icon: <Bolt className="w-5 h-5 text-green-500" />,
                  title: 'Lower bills',
                  desc: 'You can lower electricity bills by 8% with small changes',
                  cta: 'Optimize'
                }].map((ins, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card transition-shadow hover:shadow">
                    <div className="p-2 rounded-md bg-background/50">{ins.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{ins.title}</div>
                      <div className="text-sm text-muted-foreground">{ins.desc}</div>
                    </div>
                    <div>
                      <Button variant="link" size="sm" onClick={() => { setActiveInsight(ins); setInsightModalOpen(true) }}>{ins.cta}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Analytics: charts and lists */}
          <section className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Financial Analytics</h3>
                <div className="text-sm text-muted-foreground">Interactive</div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-56">
                  <h4 id="pieLabel" className="font-medium mb-2">Spending breakdown</h4>
                  <ResponsiveContainer width="100%" height={180} aria-labelledby="pieLabel">
                    <PieChart>
                      <Pie data={mockCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                        {mockCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="md:col-span-2">
                  <h4 id="lineLabel" className="font-medium mb-2">Monthly spending trend</h4>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height={200} aria-labelledby="lineLabel">
                      <LineChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="spend" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Top spending categories</h5>
                    <div className="space-y-3">
                      {topCategories.map((t) => (
                        <div key={t.name} className="flex items-center gap-3">
                          {/* Reserve more space for the category label to avoid overlap with the progress bar */}
                          <div className="min-w-[110px] text-sm font-medium truncate">{t.name}</div>
                          <div className="flex-1">
                            <Progress value={t.percent} aria-label={`${t.name} progress`} />
                          </div>
                          <div className="w-12 text-right text-sm font-semibold">{t.percent}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Budget Tracker & Recent Transactions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Budget Tracker</h4>
                  <Button variant="outline" size="sm">Edit budgets</Button>
                </div>

                <div className="mt-4 space-y-4">
                  {topCategories.map((t) => (
                    <div key={t.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">{t.name}</div>
                        <div className={`text-sm font-semibold ${t.percent > 90 ? 'text-red-600' : 'text-green-600'}`}>{t.percent}%</div>
                      </div>
                      <Progress value={t.percent} aria-hidden />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Recent Transactions</h4>
                  <Button variant="link" size="sm">View All</Button>
                </div>

                <ul className="mt-4 space-y-3">
                  {recentTx.map(tx => (
                    <li key={tx.id} className="flex items-center justify-between p-2 rounded-md border border-border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-sm">{tx.category === 'Food' ? '🛒' : tx.category === 'Transport' ? '🚗' : '💡'}</div>
                        <div>
                          <div className="font-medium">{tx.merchant}</div>
                          <div className="text-xs text-muted-foreground">{tx.category} • {tx.date}</div>
                        </div>
                      </div>
                      <div className="text-right font-semibold">₹{tx.amount}</div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>
      {/* Insight modal (reusable dialog) */}
      <Dialog open={insightModalOpen} onOpenChange={setInsightModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeInsight?.title || 'Insight'}</DialogTitle>
            <DialogDescription>{activeInsight?.desc || 'Details'}</DialogDescription>
          </DialogHeader>

          <div className="mt-2 text-sm text-muted-foreground">
            {/* Example expanded content depending on insight */}
            {activeInsight?.title === 'Save this month' && (
              <div>
                <p className="mb-2">Small changes you can make:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Reduce dining out — target ₹1,000 fewer outings</li>
                  <li>Pause unused subscriptions costing ₹400/month</li>
                  <li>Switch to energy-saving plan for savings on bills</li>
                </ul>
              </div>
            )}

            {activeInsight?.title === 'Unusual spending' && (
              <div>
                <p className="mb-2">We noticed a larger than usual transaction:</p>
                <p className="text-sm">₹2,400 at Grocery Mart on Oct 19. If this wasn't you, consider locking your card and reporting it.</p>
              </div>
            )}

            {activeInsight?.title === 'Lower bills' && (
              <div>
                <p className="mb-2">Quick tips to lower electricity bills:</p>
                <ol className="list-decimal pl-5 text-sm">
                  <li>Use LED lighting and smart timers</li>
                  <li>Unplug devices when not in use</li>
                  <li>Switch to a lower tariff plan if available</li>
                </ol>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating chat widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <div className="w-80 md:w-96 bg-card rounded-xl shadow-lg border p-3 mb-3" role="dialog" aria-label="AI chat widget" aria-modal="false">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div className="font-medium">Sahi Assistant</div>
              </div>
              <button aria-label="Close chat" onClick={() => setChatOpen(false)} className="text-sm text-muted-foreground">Close</button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-2" aria-live="polite">
              {messages.map(m => (
                <div key={m.id} className={`p-2 rounded-md ${m.from === 'ai' ? 'bg-muted text-muted-foreground' : 'bg-primary/5 text-primary'}`}>{m.text}</div>
              ))}
            </div>

            <div className="flex gap-2">
              <input ref={inputRef} aria-label="Type a message" value={input} onChange={e => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input) }} className="flex-1 px-3 py-2 rounded-md border border-border outline-none" />
              <Button size="sm" onClick={() => sendMessage(input)}>Send</Button>
            </div>
          </div>
        )}

        <button aria-label="Open chat" onClick={() => setChatOpen(s => !s)} className="w-14 h-14 rounded-full gradient-primary text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/40">
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      <Footer />
    </div>
  )
}

