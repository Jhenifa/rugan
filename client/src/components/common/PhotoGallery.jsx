import { motion } from 'framer-motion'
import { scaleIn, staggerContainer, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/cn'
import OptimizedImage from '@/components/common/OptimizedImage'

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
        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" variants={staggerContainer} initial='hidden' whileInView='visible' viewport={viewportOnce}>
          {images.map((img, i) => (
            <motion.div key={i} variants={scaleIn} className="rounded-2xl overflow-hidden">
              <OptimizedImage
                src={img.src}
                alt={img.alt || `Gallery image ${i + 1}`}
                aspectRatio="1/1"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
