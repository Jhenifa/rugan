import { cn } from '@/lib/cn'

/**
 * IconBox — rounded icon container
 *
 * size:    'sm' | 'md' | 'lg'
 * variant: 'green' | 'orange' | 'white' | 'dark-green'
 */
export default function IconBox({ children, size = 'md', variant = 'green', className }) {
  const sizes = {
    sm: { width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-sm)' },
    md: { width: '3rem',    height: '3rem',    borderRadius: 'var(--radius-md)' },
    lg: { width: '4rem',    height: '4rem',    borderRadius: 'var(--radius-lg)' },
  }

  const variants = {
    green:       { background: 'var(--color-primary-light)', color: 'var(--color-primary)' },
    orange:      { background: '#fde8d6',                   color: 'var(--color-btn-orange)' },
    white:       { background: 'white',                     color: 'var(--color-primary)' },
    'dark-green':{ background: 'var(--color-primary)',      color: 'white' },
  }

  return (
    <div
      className={cn('flex items-center justify-center flex-shrink-0', className)}
      style={{ ...sizes[size], ...variants[variant] }}
    >
      {children}
    </div>
  )
}
