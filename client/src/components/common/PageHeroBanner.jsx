import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'

/**
 * PageHeroBanner
 * Reusable hero used on all inner pages.
 *
 * Props:
 *   title           — main heading
 *   subtitle        — supporting text
 *   backgroundImage — optional URL for bg image with overlay
 *   backLink        — optional { to, label } breadcrumb
 *   children        — optional extra content (stat badges etc.)
 */
export default function PageHeroBanner({
  title,
  subtitle,
  backgroundImage,
  backLink,
  children,
  className = '',
}) {
  return (
    <section
      className={`page-hero ${className}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}
      }
    >
      {backgroundImage && <div className="page-hero-overlay" />}

      <div className="page-hero-content container-rugan">
        {backLink && (
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
        )}

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 900,
            color: 'white',
            maxWidth: '48rem',
            textWrap: 'balance',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              marginTop: '0.75rem',
              color: 'rgba(255,255,255,0.82)',
              fontSize: '1rem',
              maxWidth: '40rem',
              lineHeight: 1.65,
            }}
          >
            {subtitle}
          </p>
        )}

        {children && <div style={{ marginTop: '1.5rem' }}>{children}</div>}
      </div>
    </section>
  )
}
