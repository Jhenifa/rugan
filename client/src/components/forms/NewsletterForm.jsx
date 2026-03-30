import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import api from '@/lib/api'

export default function NewsletterForm() {
  const [email, setEmail]         = useState('')
  const [loading, setLoading]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await api.post('/newsletter/subscribe', { email })
      toast.success('Subscribed! Thank you for joining us.')
      setEmail('')
    } catch {
      toast.error('Could not subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
        className="form-input flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
      />
      <Button type="submit" variant="outline-white" disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  )
}
