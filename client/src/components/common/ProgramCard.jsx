import { motion } from "framer-motion";
import { fadeUp, scaleIn, viewportOnce } from "@/lib/motion";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import OptimizedImage from "@/components/common/OptimizedImage";

/**
 * ProgramCard
 * variant:
 *   'plain'   — image top, title, description, Learn More link (Programmes page)
 *   'overlay' — image with dark gradient overlay, title + description on top (Homepage)
 *
 * Props:
 *   image       — image URL
 *   title       — programme name
 *   description — short description
 *   to          — React Router link path
 *   variant     — 'plain' | 'overlay'
 */
export default function ProgramCard({
  image,
  title,
  description,
  to,
  variant = "plain",
  className,
}) {
  if (variant === "overlay") {
    return (
      <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <Link
          to={to}
          className={cn(
            "relative block rounded-2xl overflow-hidden group aspect-[4/3]",
            className,
          )}
        >
          <OptimizedImage src={image} alt={title} aspectRatio="4/3" />
        {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="text-heading-sm font-semibold text-white">{title}</h3>
            {description && (
              <p className="text-white/80 text-body-sm mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className={cn("card-hover flex flex-col h-full", className)}>
      <div className="aspect-[16/10] overflow-hidden">
        <OptimizedImage src={image} alt={title} aspectRatio="4/3" />
        </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-heading-md font-semibold text-neutral-900 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-body-sm text-neutral-500 mb-4 flex-1">
            {description}
          </p>
        )}
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 font-semibold text-sm hover:gap-3 transition-all duration-200"
          style={{ color: "var(--color-primary)" }}
        >
          Learn More <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
