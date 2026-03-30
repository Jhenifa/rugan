import { Link } from 'react-router'
import { ArrowRight, User, Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * BlogCard
 * Used on: Blog listing page
 *
 * Props:
 *   image     — cover image URL
 *   title     — post title
 *   excerpt   — short description
 *   author    — author name
 *   date      — formatted date string e.g. "February 15, 2026"
 *   to        — React Router link path
 */
export default function BlogCard({ image, title, excerpt, author, date, to, className }) {
  return (
    <div className={cn('card-hover flex flex-col', className)}>
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-heading-md font-semibold text-neutral-900 mb-2 line-clamp-2">{title}</h3>
        {excerpt && (
          <p className="text-body-sm text-neutral-500 mb-4 flex-1 line-clamp-3">{excerpt}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4">
          {author && (
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {author}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {date}
            </span>
          )}
        </div>

        <Link
          to={to}
          className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:gap-3 transition-all duration-200"
        >
          Read More <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
