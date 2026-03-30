import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/cn'

/**
 * SuccessStoryCard
 * Used on: Impact page — Success Stories section
 *
 * Props:
 *   image       — photo URL
 *   name        — person's name
 *   description — e.g. "SS3 Student – Enugu State"
 *   quote       — testimonial quote
 *   program     — related program name (shown as badge)
 */
export default function SuccessStoryCard({ image, name, description, quote, program, className }) {
  return (
    <div className={cn('card flex flex-col', className)}>
      {/* Photo */}
      <div className="aspect-[4/3] overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h4 className="text-heading-sm font-semibold text-neutral-900">{name}</h4>
        {description && (
          <p className="text-xs text-neutral-400 mt-0.5 mb-3">{description}</p>
        )}
        {quote && (
          <blockquote className="text-body-sm text-neutral-600 italic flex-1 border-l-2 border-primary-300 pl-3">
            "{quote}"
          </blockquote>
        )}
        {program && (
          <div className="mt-4">
            <Badge variant="green">{program}</Badge>
          </div>
        )}
      </div>
    </div>
  )
}
