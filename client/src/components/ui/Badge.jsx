import { cn } from '@/lib/cn'

/**
 * Badge
 * variant: 'green' | 'orange' | 'gray'
 */
export default function Badge({ children, variant = 'green', className }) {
  const variants = {
    green:  'badge-green',
    orange: 'badge-orange',
    gray:   'badge',
  }

  const grayStyle = variant === 'gray'
    ? { background: '#F3F4F6', color: '#374151' }
    : {}

  return (
    <span className={cn('badge', variants[variant], className)} style={grayStyle}>
      {children}
    </span>
  )
}
