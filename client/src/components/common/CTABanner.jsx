import { Link } from 'react-router'
import Button from '@/components/ui/Button'

/**
 * CTABanner — full-width CTA strip
 *
 * variant:
 *   'cta'  — #548349 mid-page green banner (default)
 *   'teal' — #5B8A8C teal (newsletter / partner sections)
 *
 * buttons — array of:
 *   { label, to?, href?, variant, onClick? }
 *   Use variant 'primary' for orange, 'volunteer' for white/green text,
 *   'outline-white' for transparent white border.
 */
export default function CTABanner({ title, subtitle, buttons = [], variant = 'cta', className = '' }) {
  const sectionClass = variant === 'teal' ? 'section-teal' : 'section-cta'

  return (
    <section className={`${sectionClass} section-padding-sm ${className}`}>
      <div className="container-rugan text-center">
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'white',
            textWrap: 'balance',
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              marginTop: '0.75rem',
              color: 'rgba(255,255,255,0.82)',
              fontSize: '1rem',
              maxWidth: '36rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.65,
            }}
          >
            {subtitle}
          </p>
        )}

        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {buttons.map((btn, i) => {
              if (btn.to) {
                return (
                  <Button key={i} as={Link} to={btn.to} variant={btn.variant || 'primary'} size="lg">
                    {btn.label}
                  </Button>
                )
              }
              if (btn.href) {
                return (
                  <Button key={i} as="a" href={btn.href} variant={btn.variant || 'primary'} size="lg">
                    {btn.label}
                  </Button>
                )
              }
              return (
                <Button key={i} variant={btn.variant || 'primary'} size="lg" onClick={btn.onClick}>
                  {btn.label}
                </Button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
