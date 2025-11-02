import React, { useMemo, useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Sparkles, PlusCircle } from 'lucide-react'

const overview = [
  { label: 'Total Saved', value: '₹1,25,000' },
  { label: 'Active Goals', value: 4 },
  { label: 'Goals Completed', value: 2 },
  { label: "This Month's Savings", value: '₹8,500' },
]

const goals = [
  { id: 1, name: 'Emergency Fund', target: 50000, saved: 32000, deadline: '4 months', prob: 'High' },
  { id: 2, name: 'Dream Vacation', target: 80000, saved: 15000, deadline: '8 months', prob: 'Medium' },
  { id: 3, name: 'New Laptop', target: 65000, saved: 58000, deadline: '1 month', prob: 'High' },
  { id: 4, name: 'Wedding Fund', target: 200000, saved: 45000, deadline: '12 months', prob: 'Low' },
]

const recommendations = [
  { id: 'r1', name: 'Build 6-Month Emergency Fund', amount: '₹1,50,000', months: 10, monthly: '₹15,000' },
  { id: 'r2', name: 'Save for Health Insurance', amount: '₹25,000', months: 5, monthly: '₹5,000' },
  { id: 'r3', name: 'Festival Shopping Fund', amount: '₹30,000', months: 4, monthly: '₹7,500' },
]

const savingsTrend = [
  { month: 'May', saved: 6000 },
  { month: 'Jun', saved: 7200 },
  { month: 'Jul', saved: 6500 },
  { month: 'Aug', saved: 12500 },
  { month: 'Sep', saved: 4200 },
  { month: 'Oct', saved: 8500 },
]

export default function SmartSavings() {
  const [createOpen, setCreateOpen] = useState(false)
  const [createStep, setCreateStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState(null)

  const progress = (g) => Math.round((g.saved / g.target) * 100)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hero */}
        <section className="rounded-xl p-8 gradient-hero text-card-foreground flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Smart Savings Goals</h1>
            <p className="text-muted-foreground mt-2">AI-powered goal planning to help you achieve your dreams faster</p>
            <div className="mt-4">
              <Button variant="default" onClick={() => { setCreateOpen(true); setCreateStep(1) }}><PlusCircle className="w-4 h-4 mr-2" />Create New Goal</Button>
            </div>
          </div>
          <div className="w-36 h-36 bg-card rounded-xl flex items-center justify-center shadow-md">🎯</div>
        </section>

        {/* Overview */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overview.map((o) => (
            <Card key={o.label} className="p-4">
              <div className="text-sm text-muted-foreground">{o.label}</div>
              <div className="font-semibold mt-2">{o.value}</div>
            </Card>
          ))}
        </section>

        {/* Active Goals */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Your Savings Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map(g => (
              <Card key={g.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{g.name}</div>
                  <div className={`text-sm font-semibold ${g.prob === 'High' ? 'text-green-600' : g.prob === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>{g.prob}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">Target: ₹{g.target.toLocaleString('en-IN')}</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={progress(g)} />
                  </div>
                  <div className="w-12 text-right font-semibold">{progress(g)}%</div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">Saved: ₹{g.saved.toLocaleString('en-IN')} • {g.deadline}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="default">Add Money</Button>
                  <Button size="sm" variant="outline">Edit Goal</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recommended Goals for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map(r => (
              <Card key={r.id} className="p-4">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-muted-foreground">Recommended: {r.amount} • {r.months} months</div>
                <div className="mt-2 text-sm">Monthly: <strong>{r.monthly}</strong></div>
                <div className="mt-4">
                  <Button variant="default" size="sm">Create This Goal</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Insights & Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold">Savings Insights</h3>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={savingsTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="saved" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold">Automated Savings Features</h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Round-Up Savings</div>
                  <div className="text-sm text-muted-foreground">Enable round-ups to save spare change</div>
                </div>
                <Button size="sm" variant="default">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-Save Rules</div>
                  <div className="text-sm text-muted-foreground">Save ₹500 every Friday</div>
                </div>
                <Button size="sm" variant="default">Manage</Button>
              </div>
              <div className="p-3 rounded-md bg-amber-50 border border-amber-200">
                <div className="font-medium">Spare Change Analyzer</div>
                <div className="text-sm text-muted-foreground">AI found ₹2,400 you can save monthly</div>
                <div className="mt-2"><Button size="sm">Apply Suggestions</Button></div>
              </div>
            </div>
          </Card>
        </section>

        {/* Completed & Tips */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold">Completed Goals</h3>
            <div className="mt-3 text-sm text-muted-foreground">No recently completed goals</div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold">Savings Tips</h3>
            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-md bg-card">Cut coffee shop visits by 50% to reach vacation goal 2 months earlier</div>
              <div className="p-3 rounded-md bg-card">Your wedding fund is behind schedule. Increase monthly contribution by ₹3,000</div>
            </div>
          </Card>
        </section>

      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>Step {createStep} of 4</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {createStep === 1 && (
              <div>
                <div className="text-sm">Goal details form (name, category, icon)</div>
                <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => setCreateStep(2)}>Next</Button></div>
              </div>
            )}
            {createStep === 2 && (
              <div>
                <div className="text-sm">Target & Timeline (amount, date picker)</div>
                <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => setCreateStep(3)}>Next</Button></div>
              </div>
            )}
            {createStep === 3 && (
              <div>
                <div className="text-sm">Savings Strategy (frequency, auto-save)</div>
                <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => setCreateStep(4)}>Next</Button></div>
              </div>
            )}
            {createStep === 4 && (
              <div>
                <div className="text-sm">Review & Create</div>
                <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => setCreateOpen(false)}>Create Goal</Button></div>
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

      <Footer />
    </div>
  )
}
