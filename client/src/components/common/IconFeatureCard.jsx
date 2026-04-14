import { motion } from 'framer-motion'
import { scaleIn, viewportOnce } from '@/lib/motion'
import IconBox from '@/components/ui/IconBox'

/**
 * IconFeatureCard — icon + title + description
 *
 * variant: 'default' | 'light-green' | 'outlined'
 */
export default function IconFeatureCard({
  icon: Icon,
  title,
  description,
  variant = 'outlined',
  iconVariant = 'green',
  className = '',
}) {
  const backgrounds = {
    default:      'var(--color-white)',
    'light-green':'var(--color-bg-green-tint)',
    outlined:     'var(--color-white)',
  }

  const borders = {
    default:      'none',
    'light-green':'none',
    outlined:     '1px solid var(--color-border)',
  }

  const shadows = {
    default: 'var(--shadow-card)',
    'light-green': 'none',
    outlined: 'none',
  }

  return (
    <motion.div
      variants={scaleIn}
      initial='hidden'
      whileInView='visible'
      viewport={viewportOnce}
      className={`rounded-2xl p-6 ${className}`}
      style={{
        background: backgrounds[variant],
        border:     borders[variant],
        boxShadow:  shadows[variant],
      }}
    >
      {Icon && (
        <IconBox size="md" variant={iconVariant} className="mb-4">
          <Icon size={20} />
        </IconBox>
      )}
      <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
