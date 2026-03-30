import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * FAQAccordion
 * Used on: Volunteer page
 *
 * Props:
 *   items — array of { question, answer }
 */
export default function FAQAccordion({ items = [], className }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className={cn('flex flex-col divide-y divide-neutral-100', className)}>
      {items.map((item, i) => (
        <div key={i} className="py-5">
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between gap-4 text-left group"
            aria-expanded={openIndex === i}
          >
            <span className="text-heading-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
              {item.question}
            </span>
            <ChevronDown
              size={20}
              className={cn(
                'shrink-0 text-neutral-400 transition-transform duration-300',
                openIndex === i && 'rotate-180 text-primary-500'
              )}
            />
          </button>

          {/* Answer */}
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              openIndex === i ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
            )}
          >
            <p className="text-body-sm text-neutral-500">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
