import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, fadeIn, staggerContainer, viewportOnce } from '@/lib/motion'

export default function PageHeroBanner({
  title,
  subtitle,
  backgroundImage,
  backLink,
  children,
  centerText = false,
  darkOverlay = false,
  className = '',
}) {
  return (
    <section
      className={`page-hero ${className}`}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {}
      }
    >
      {backgroundImage && (
        <div
          className="page-hero-overlay"
          style={darkOverlay ? { backgroundColor: 'rgba(10, 25, 10, 0.91)' } : {}}
        />
      )}

      <motion.div
        className="page-hero-content container-rugan"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {backLink && (
          <motion.div variants={fadeIn}>
            <Link
              to={backLink.to}
              className="inline-flex items-center gap-1 mb-4 transition-colors"
              style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >
              <ChevronLeft size={16} />
              {backLink.label}
            </Link>
          </motion.div>
        )}

        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'white',
            maxWidth: '48rem',
            textWrap: 'balance',
            lineHeight: 1.2,
            textAlign: centerText ? 'center' : 'left',
            margin: centerText ? '0 auto' : undefined,
          }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            variants={fadeUp}
            style={{
              marginTop: '0.75rem',
              color: 'rgba(255,255,255,0.82)',
              fontSize: '1rem',
              maxWidth: '40rem',
              lineHeight: 1.65,
              textAlign: centerText ? 'center' : 'left',
              margin: centerText ? '0.75rem auto 0' : undefined,
            }}
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div variants={fadeUp} style={{ marginTop: '1.5rem' }}>
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
