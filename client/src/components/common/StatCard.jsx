import { motion } from 'framer-motion'
import { scaleIn, viewportOnce } from '@/lib/motion'
import IconBox from '@/components/ui/IconBox'

/**
 * StatCard — metric display with icon, number, and label
 *
 * variant: 'bordered' | 'plain'
 */
export default function StatCard({ icon: Icon, value, label, variant = 'bordered', className = '' }) {
  return (
    <motion.div variants={scaleIn} initial='hidden' whileInView='visible' viewport={viewportOnce}
      className={`flex flex-col items-center text-center gap-3 p-6 ${variant === 'bordered' ? 'card' : ''} ${className}`}
      style={variant === 'bordered' ? { border: '1px solid var(--color-border)' } : {}}
    >
      {Icon && (
        <IconBox size="md" variant="green">
          <Icon size={22} />
        </IconBox>
      )}
      <p style={{ fontSize: '2.25rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{label}</p>
    </motion.div>
  )
}
