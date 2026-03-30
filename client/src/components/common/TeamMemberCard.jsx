import { Linkedin, Mail } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * TeamMemberCard
 * Used on: Team page
 *
 * Props:
 *   image       — photo URL
 *   name        — full name
 *   role        — job title
 *   roleColor   — 'green' | 'orange' (alternates per design)
 *   bio         — biography text
 *   linkedin    — LinkedIn profile URL
 *   email       — email address
 */
export default function TeamMemberCard({ image, name, role, roleColor = 'green', bio, linkedin, email, className }) {
  const roleColors = {
    green:  'text-primary-600',
    orange: 'text-secondary-500',
  }

  return (
    <div className={cn('card-hover flex flex-col', className)}>
      {/* Photo */}
      <div className="aspect-[4/3] overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover object-top" />
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-heading-md font-semibold text-neutral-900">{name}</h3>
        <p className={cn('text-body-sm font-medium mt-0.5 mb-3', roleColors[roleColor])}>{role}</p>
        {bio && <p className="text-body-sm text-neutral-500 flex-1 line-clamp-5">{bio}</p>}

        {/* Social links */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-box-sm hover:bg-primary-200 transition-colors"
              aria-label={`${name} LinkedIn`}
            >
              <Linkedin size={16} />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="icon-box-sm hover:bg-primary-200 transition-colors"
              aria-label={`Email ${name}`}
            >
              <Mail size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
