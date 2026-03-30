import { cn } from '@/lib/cn'

/**
 * PhotoGallery
 * Used on: Program detail pages (Program Gallery), Impact page (Impact in Action)
 *
 * Props:
 *   images  — array of { src, alt } objects (ideally 6 for 3x2 grid)
 *   bgColor — 'light-green' | 'white'
 */
export default function PhotoGallery({ images = [], bgColor = 'light-green', className }) {
  const bg = bgColor === 'light-green' ? 'section-light-green' : 'bg-white'

  return (
    <section className={cn(bg, 'section-padding', className)}>
      <div className="container-rugan">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={img.src}
                alt={img.alt || `Gallery image ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
