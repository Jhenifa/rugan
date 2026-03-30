import { cn } from '@/lib/cn'

/**
 * Timeline
 * Used on: About page — Timeline of Impact (2022–2026)
 * Alternating left/right layout on desktop, stacked on mobile
 *
 * Props:
 *   items — array of { year, title, description, side: 'left'|'right' }
 */
export default function Timeline({ items = [], className }) {
  return (
    <div className={cn('relative', className)}>
      {/* Center vertical line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 -translate-x-1/2" />

      <div className="flex flex-col gap-10 md:gap-16">
        {items.map((item, i) => {
          const isLeft = item.side === 'left' || i % 2 === 0

          return (
            <div key={i} className={cn('relative flex flex-col md:flex-row items-start md:items-center gap-6', !isLeft && 'md:flex-row-reverse')}>
              {/* Content box */}
              <div className={cn('w-full md:w-[calc(50%-2rem)]', isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8')}>
                <div className="card p-6">
                  <span className="text-primary-500 font-bold text-lg">{item.year}</span>
                  <h3 className="text-heading-sm font-semibold text-neutral-900 mt-1 mb-2">{item.title}</h3>
                  <p className="text-body-sm text-neutral-500">{item.description}</p>
                </div>
              </div>

              {/* Center dot */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow-md z-10" />

              {/* Spacer for opposite side */}
              <div className="hidden md:block w-full md:w-[calc(50%-2rem)]" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
