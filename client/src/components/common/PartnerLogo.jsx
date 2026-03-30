import { cn } from '@/lib/cn'

/**
 * PartnerLogo
 * Used on: Partnership page — Our Partners section
 *
 * Props:
 *   logo — image URL
 *   name — organization name
 *   url  — optional link
 */
export default function PartnerLogo({ logo, name, url, className }) {
  const content = (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="w-32 h-32 rounded-full overflow-hidden bg-white shadow-card flex items-center justify-center p-3">
        <img src={logo} alt={name} className="w-full h-full object-contain" />
      </div>
      <p className="text-white font-semibold text-center text-body-sm">{name}</p>
    </div>
  )

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
        {content}
      </a>
    )
  }

  return content
}
