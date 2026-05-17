import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";


export default function PageHeroBanner({
  title,
  subtitle,
  backgroundImage,
  backLink,
  breadcrumbs = [],
  children,
  centerText = false,
  darkOverlay = false,
  className = "",
  imagePriority = true,
}) {
  return (
    <section
      className={`page-hero relative overflow-hidden ${className}`}
      style={!backgroundImage ? { backgroundColor: "#17311a" } : undefined}
    >
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading={imagePriority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={imagePriority ? "high" : "auto"}
        />
      ) : null}

      <div
        className="page-hero-overlay"
        style={darkOverlay ? { backgroundColor: "rgba(10, 25, 10, 0.84)" } : undefined}
      />

      <motion.div
        className="page-hero-content container-rugan relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >


        {backLink ? (
          <motion.div variants={fadeIn}>
            <Link
              to={backLink.to}
              className="mb-4 inline-flex items-center gap-1 transition-colors"
              style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem" }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color = "white";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = "rgba(255,255,255,0.75)";
              }}
            >
              <ChevronLeft size={16} />
              {backLink.label}
            </Link>
          </motion.div>
        ) : null}

        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: "clamp(1.625rem, 7vw, 2.5rem)",
            fontWeight: 900,
            color: "white",
            maxWidth: "48rem",
            textWrap: "balance",
            lineHeight: 1.2,
            textAlign: centerText ? "center" : "left",
            margin: centerText ? "0 auto" : undefined,
          }}
        >
          {title}
        </motion.h1>

        {subtitle ? (
          <motion.p
            variants={fadeUp}
            style={{
              marginTop: "0.75rem",
              color: "rgba(255,255,255,0.82)",
              fontSize: "clamp(0.9375rem, 4vw, 1rem)",
              maxWidth: "40rem",
              lineHeight: 1.65,
              textAlign: centerText ? "center" : "left",
              marginLeft: centerText ? "auto" : undefined,
              marginRight: centerText ? "auto" : undefined,
            }}
          >
            {subtitle}
          </motion.p>
        ) : null}

        {children ? (
          <motion.div variants={fadeUp} style={{ marginTop: "1.25rem" }}>
            {children}
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
