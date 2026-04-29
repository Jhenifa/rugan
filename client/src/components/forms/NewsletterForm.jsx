import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function NewsletterForm() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await api.post('/newsletter/subscribe', { email })
      toast.success('Subscribed! Thank you for joining us.')
      setEmail('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-[480px] flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
        style={{
          flex: 1,
          minWidth: 0,
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          border: '1.5px solid rgba(255,255,255,0.3)',
          background: 'white',
          color: '#111827',
          fontSize: '0.9375rem',
          outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)' }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto"
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          background: 'white',
          color: 'var(--color-primary)',
          fontSize: '0.9375rem',
          fontWeight: 600,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 200ms',
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  )
}
