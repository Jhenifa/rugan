import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/motion'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * ChecklistItem
 * variant: 'card' | 'plain'
 */
export default function ChecklistItem({ text, variant = 'card', className }) {
  const icon = (
    <CheckCircle2
      size={18}
      style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '1px' }}
    />
  )

  if (variant === 'plain') {
    return (
      <li className={cn('flex items-start gap-2.5', className)} style={{ fontSize: '0.875rem', color: '#374151' }}>
        {icon}
        <span>{text}</span>
      </li>
    )
  }

  return (
    <motion.div
      variants={fadeUp}
      initial='hidden'
      whileInView='visible'
      viewport={viewportOnce}
      className={cn('flex items-start gap-3 p-4 rounded-xl bg-white', className)}
      style={{
        border: '1px solid #E5E7EB',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        cursor: 'default',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)'
        e.currentTarget.style.boxShadow   = '0 2px 10px rgba(79,123,68,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E7EB'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      {icon}
      <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{text}</span>
    </motion.div>
  )
}
