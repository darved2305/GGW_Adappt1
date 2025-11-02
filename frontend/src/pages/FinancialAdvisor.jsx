import React, { useMemo, useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, PiggyBank, CreditCard, ShieldAlert, Percent, Cpu } from 'lucide-react'

const scoreBreakdown = [
  { key: 'Savings Health', score: 30, max: 30 },
  { key: 'Spending Habits', score: 25, max: 25 },
  // intentionally slightly lower investment score so overall is not 100
  { key: 'Investment Portfolio', score: 15, max: 20 },
  { key: 'Debt Management', score: 20, max: 25 },
]

const recommendations = [
  { id: 1, icon: <TrendingUp className="w-6 h-6 text-primary" />, title: 'Start SIP in Mutual Funds', desc: 'Based on your spending pattern, you can invest ₹3,000/month', returns: 'Potential returns: ₹5.2L in 5 years', risk: 'Medium' },
  { id: 2, icon: <PiggyBank className="w-6 h-6 text-primary" />, title: 'Reduce Food Delivery Expenses', desc: "You're spending 23% more on food delivery than similar users", savings: 'Save ₹2,500/month', risk: 'Low' },
  { id: 3, icon: <CreditCard className="w-6 h-6 text-primary" />, title: 'Pay Off High-Interest Debt First', desc: 'Credit card APR: 42%. Pay ₹5,000 extra to save ₹15,000 in interest', risk: 'High' },
  { id: 4, icon: <Percent className="w-6 h-6 text-primary" />, title: 'Maximize Tax Savings', desc: 'Invest ₹46,000 more in 80C to save ₹14,500 in taxes', deadline: '45 days left', risk: 'Low' },
  { id: 5, icon: <ShieldAlert className="w-6 h-6 text-primary" />, title: 'Improve Your Credit Score', desc: 'Current score: 720. Pay bills on time to reach 800+', impact: 'Better loan rates available at 750+', risk: 'Low' },
  { id: 6, icon: <ShieldAlert className="w-6 h-6 text-primary" />, title: 'Build Emergency Fund', desc: 'Recommended: ₹1.5L (6 months expenses). Current: ₹40,000', risk: 'Low' },
]

const actions = [
  { id: 'a1', priority: 'HIGH', title: 'Link Aadhaar to PAN', desc: 'Avoid penalties', time: '5 mins', benefit: '₹10,000 fine avoidance' },
  { id: 'a2', priority: 'MEDIUM', title: 'Review insurance coverage', desc: 'Under-insured by ₹5L', time: '15 mins', benefit: '' },
  { id: 'a3', priority: 'LOW', title: 'Organize receipts', desc: 'Tax-friendly records', time: '10 mins', benefit: '' },
]

const investments = [
  { name: 'Fixed Deposits', risk: 'Low', returns: '7.5%', min: '₹10,000' },
  { name: 'Mutual Funds', risk: 'Medium', returns: '12% avg', min: '₹500' },
  { name: 'Gold', risk: 'Medium', returns: '8%', min: '₹1,000' },
  { name: 'Digital Gold', risk: 'Medium', returns: '8.5%', min: '₹100' },
]

const mockTrend = [
  { month: 'May', score: 62 },
  { month: 'Jun', score: 65 },
  { month: 'Jul', score: 68 },
  { month: 'Aug', score: 70 },
  { month: 'Sep', score: 74 },
  { month: 'Oct', score: 80 },
]

export default function FinancialAdvisor() {
  const totalScore = scoreBreakdown.reduce((s, c) => s + c.score, 0)
  const maxScore = scoreBreakdown.reduce((s, c) => s + c.max, 0)
  const percent = Math.round((totalScore / maxScore) * 100)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  const showRecommendationDetails = (r) => {
    // build structured modal content per recommendation id
    if (r.id === 1) {
      // mutual fund suggestions for 'wg' (mock)
      setModalContent({
        type: 'mutualFunds',
        title: r.title,
        funds: [
          { name: 'Axis Bluechip Fund - Direct', risk: 'Medium', expReturn: '12% CAGR', expenseRatio: '0.28%', minSip: '₹500' },
          { name: 'HDFC Midcap Opportunities - Direct', risk: 'High', expReturn: '15% CAGR', expenseRatio: '0.45%', minSip: '₹500' },
          { name: 'SBI Magnum Multicap - Direct', risk: 'Medium', expReturn: '13% CAGR', expenseRatio: '0.30%', minSip: '₹500' },
        ],
      })
      setModalOpen(true)
      return
    }

    // generic fallback with more detailed suggestions per card
    if (r.id === 2) {
      setModalContent({ type: 'text', title: r.title, body: `${r.desc}\nPotential savings: ${r.savings || ''}\nSuggestions:\n• Cook at home more\n• Schedule weekly meal prep\n• Use offers and subscriptions wisely` })
      setModalOpen(true)
      return
    }

    if (r.id === 3) {
      setModalContent({ type: 'text', title: r.title, body: `${r.desc}\nSuggested plan:\n• Pay extra ₹5,000/month to high-interest card\n• Rebalance revolving debt to EMI plan` })
      setModalOpen(true)
      return
    }

    if (r.id === 4) {
      setModalContent({ type: 'text', title: r.title, body: `${r.desc}\nDeadline: ${r.deadline || 'N/A'}\nOptions:\n• ELSS funds
• PPF/top-up
• Employer tax-saving plans` })
      setModalOpen(true)
      return
    }

    if (r.id === 5) {
      setModalContent({ type: 'text', title: r.title, body: `${r.desc}\nTips:\n• Keep credit utilisation under 30%\n• Pay EMIs on time\n• Avoid hard enquiries` })
      setModalOpen(true)
      return
    }

    // default
    setModalContent({ type: 'text', title: r.title, body: r.desc })
    setModalOpen(true)
  }

  const rating = useMemo(() => {
    if (percent > 80) return 'Excellent'
    if (percent >= 60) return 'Good'
    return 'Needs Improvement'
  }, [percent])

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hero */}
        <section className="rounded-xl p-8 gradient-hero text-card-foreground">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-semibold">Your AI Financial Advisor</h1>
              <p className="mt-2 text-muted-foreground">Personalized recommendations powered by AI to help you achieve your financial goals</p>
              <div className="mt-4">
                <Button variant="default" onClick={() => { setModalContent({ type: 'text', title: 'Detailed Analysis', body: 'This would show a detailed analysis of your financial health.' }); setModalOpen(true) }}>View Detailed Analysis</Button>
              </div>
            </div>
            <div className="w-40 h-40 bg-card rounded-xl flex items-center justify-center shadow-md">
              <Cpu className="w-20 h-20 text-primary" />
            </div>
          </div>
        </section>

        {/* Score Card */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1">
            <h3 className="font-semibold mb-4">Financial Health Score</h3>
            <div className="flex items-center gap-6">
              <div style={{ width: 140, height: 140 }}>
                <ResponsiveContainer width="100%" height={140}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={[{ name: 'score', value: percent }]}>
                    <RadialBar minAngle={15} background clockWise={false} dataKey="value" fill="#3b82f6" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold">{percent}</div>
                <div className="text-sm text-muted-foreground">Overall score (out of 100)</div>
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${percent > 80 ? 'bg-green-100 text-green-700' : percent >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{rating}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {scoreBreakdown.map(s => (
                <div key={s.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div>{s.key}</div>
                    <div className="font-semibold">{s.score}/{s.max}</div>
                  </div>
                  <Progress value={Math.round((s.score / s.max) * 100)} />
                </div>
              ))}
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Recommendations Just For You</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map(r => (
                  <div key={r.id} className="p-4 rounded-lg border border-border bg-card transition-shadow hover:shadow">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-background/50">{r.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{r.title}</div>
                        <div className="text-sm text-muted-foreground">{r.desc}</div>
                        {r.returns && <div className="mt-2 text-sm text-muted-foreground">{r.returns}</div>}
                        {r.savings && <div className="mt-2 text-sm text-muted-foreground">{r.savings}</div>}
                      </div>
                      <div>
                        <Button variant="link" size="sm" onClick={() => showRecommendationDetails(r)}>{r.returns || r.savings ? 'Learn More' : 'View'}</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-4">Take Action This Week</h4>
              <div className="space-y-3">
                {actions.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-md border border-border bg-card">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${a.priority === 'HIGH' ? 'bg-red-100 text-red-700' : a.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{a.priority}</span>
                        <div className="font-medium">{a.title}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{a.desc}</div>
                    </div>
                    <div className="text-sm text-right">
                      <div className="font-semibold">{a.benefit}</div>
                      <div className="text-xs text-muted-foreground">{a.time}</div>
                      <div className="mt-2">
                        <Button size="sm" variant="default">Do It Now</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-4">Recommended Investments for You</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.map(inv => (
                  <div key={inv.name} className="p-4 rounded-md border border-border bg-card flex items-center justify-between">
                    <div>
                      <div className="font-medium">{inv.name}</div>
                      <div className="text-sm text-muted-foreground">{inv.returns} • Min {inv.min}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm">Risk: {inv.risk}</div>
                      <Button size="sm" variant="default">Invest Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Have Questions? Ask Your AI Advisor</h4>
                <Button variant="default" onClick={() => window.location.href = '/dashboard'}>Chat with Advisor</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['How can I save more money?', "What's the best investment for me?", 'How to reduce my expenses?', 'Should I take a loan?', 'How to improve credit score?'].map((q, i) => (
                  <Button key={i} variant="outline" size="sm" onClick={() => { setModalContent({ type: 'text', title: 'Ask Advisor', body: q }); setModalOpen(true) }}>{q}</Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-4">Your Progress This Month</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-md border border-border bg-card">
                  <div className="text-sm text-muted-foreground">Money Saved</div>
                  <div className="font-semibold">₹4,200</div>
                  <div className="text-xs text-green-600">↑ 15%</div>
                </div>
                <div className="p-3 rounded-md border border-border bg-card">
                  <div className="text-sm text-muted-foreground">Recommendations Followed</div>
                  <div className="font-semibold">3/5</div>
                </div>
                <div className="p-3 rounded-md border border-border bg-card">
                  <div className="text-sm text-muted-foreground">Health Score Change</div>
                  <div className="font-semibold">+12</div>
                </div>
              </div>
              <div className="mt-4 h-36">
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={mockTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </section>

        <div />
      </main>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalContent?.title}</DialogTitle>
            <DialogDescription>{modalContent?.type === 'mutualFunds' ? 'Suggested mutual funds based on your profile' : modalContent?.body}</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {modalContent?.type === 'mutualFunds' && (
              <div className="space-y-3">
                {modalContent.funds.map((f, idx) => (
                  <div key={idx} className="p-3 rounded-md border border-border bg-card flex items-center justify-between">
                    <div>
                      <div className="font-medium">{f.name}</div>
                      <div className="text-sm text-muted-foreground">{f.risk} • {f.expReturn} • ER {f.expenseRatio}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm">Min SIP: {f.minSip}</div>
                      <div>
                        <Button size="sm" variant="default">Invest</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {modalContent?.type === 'text' && (
              <div className="whitespace-pre-line text-sm text-muted-foreground">{modalContent.body}</div>
            )}
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
