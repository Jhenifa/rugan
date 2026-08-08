import { motion } from 'framer-motion'
import { scaleIn, viewportOnce } from '@/lib/motion'
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
 *   programme     — related programme name (shown as badge)
 */
export default function SuccessStoryCard({
  image,
  name,
  description,
  quote,
  programme,
  program,
  className,
}) {
  const label = programme || program

  return (
    <motion.div variants={scaleIn} initial='hidden' whileInView='visible' viewport={viewportOnce} className={cn('card flex flex-col', className)}>
      {/* Photo */}
      <div className="aspect-[4/3] overflow-hidden">
        <img loading="lazy" src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h4 className="text-heading-sm font-semibold text-neutral-900">{name}</h4>
        {description && (
          <p className="text-xs text-[#474B52] mt-0.5 mb-3">{description}</p>
        )}
        {quote && (
          <blockquote className="text-body-sm text-neutral-600 italic flex-1 border-l-2 border-primary-300 pl-3">
            "{quote}"
          </blockquote>
        )}
        {label && (
          <div className="mt-4">
            <span
              className="inline-flex items-center rounded-[10px] px-3 py-1.5 text-[0.8125rem] font-semibold"
              style={{ background: '#DCFCE7', color: '#4F7B44' }}
            >
              {label}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
