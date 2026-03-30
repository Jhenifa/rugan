/**
 * SectionHeader — centered section title + optional subtitle
 *
 * Props:
 *   title    — section heading
 *   subtitle — supporting text
 *   align    — 'center' (default) | 'left'
 *   theme    — 'dark' (default, on light bg) | 'light' (on colored bg)
 */
export default function SectionHeader({ title, subtitle, align = 'center', theme = 'dark', className = '' }) {
  const isLight = theme === 'light'
  const textAlign = align === 'left' ? 'left' : 'center'

  return (
    <div
      className={className}
      style={{
        textAlign,
        marginBottom: '3rem',
      }}
    >
      <h2
        className="section-title"
        style={{
          color: isLight ? 'white' : '#111827',
          textAlign,
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="section-subtitle"
          style={{
            color: isLight ? 'rgba(255,255,255,0.82)' : undefined,
            textAlign,
            marginLeft: align === 'left' ? 0 : undefined,
            marginRight: align === 'left' ? 0 : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
