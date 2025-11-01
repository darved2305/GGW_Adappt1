import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../helper/supabaseClient';
import { login } from '@/lib/auth'

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    }
    if (data) {
      setMessage("Login successful!");
      navigate('/home');
    }

    setEmail("");
    setPassword("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 rounded-md gradient-primary text-white" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
