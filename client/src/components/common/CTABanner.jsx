import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
import Button from '@/components/ui/Button'

export default function CTABanner({ title, subtitle, buttons = [], variant = 'cta', className = '' }) {
  const sectionClass = variant === 'teal' ? 'section-teal' : 'section-cta'

  return (
    <section className={`${sectionClass} section-padding-sm ${className}`}>
      <motion.div
        className="container-rugan text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.h2
          variants={fadeUp}
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', textWrap: 'balance' }}
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            variants={fadeUp}
            style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.82)', fontSize: '1rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65 }}
          >
            {subtitle}
          </motion.p>
        )}

        {buttons.length > 0 && (
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center mt-8">
            {buttons.map((btn, i) => {
              if (btn.to) return <Button key={i} as={Link} to={btn.to} variant={btn.variant || 'primary'} size="lg">{btn.label}</Button>
              if (btn.href) return <Button key={i} as="a" href={btn.href} variant={btn.variant || 'primary'} size="lg">{btn.label}</Button>
              return <Button key={i} variant={btn.variant || 'primary'} size="lg" onClick={btn.onClick}>{btn.label}</Button>
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
