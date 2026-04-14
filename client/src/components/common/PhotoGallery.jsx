import { motion } from 'framer-motion'
import { scaleIn, staggerContainer, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * PhotoGallery
 * Used on: Programme detail pages (Programme Gallery), Impact page (Impact in Action)
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
        <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4" variants={staggerContainer} initial='hidden' whileInView='visible' viewport={viewportOnce}>
          {images.map((img, i) => (
            <motion.div key={i} variants={scaleIn} className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={img.src}
                alt={img.alt || `Gallery image ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
