import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

export default function SectionHeader({ title, subtitle, align = 'center', theme = 'dark', className = '' }) {
  const isLight   = theme === 'light'
  const textAlign = align === 'left' ? 'left' : 'center'

  return (
    <motion.div
      className={className}
      style={{ textAlign, marginBottom: '3rem' }}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <motion.h2
        variants={fadeUp}
        className="section-title"
        style={{ color: isLight ? 'white' : '#111827', textAlign }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="section-subtitle"
          style={{
            color: isLight ? 'rgba(255,255,255,0.82)' : undefined,
            textAlign,
            marginLeft: align === 'left' ? 0 : undefined,
            marginRight: align === 'left' ? 0 : undefined,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
