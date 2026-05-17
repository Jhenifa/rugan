import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  Users,
} from "lucide-react";
import SEO from "@/components/SEO";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import VolunteerForm from "@/components/forms/VolunteerForm";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import {
  VOLUNTEER_BENEFITS,
  VOLUNTEER_EXPECTATIONS,
  VOLUNTEER_FAQS,
  VOLUNTEER_OPPORTUNITIES,
  VOLUNTEER_PHOTOS,
  VOLUNTEER_STORIES,
  VOLUNTEER_WHO,
} from "@/data/volunteer";

function WhoCard({ label }) {
  return (
    <div
      style={{
        borderRadius: "1rem",
        padding: "1.5rem 1.25rem",
        background: "#F0FDF4",
        border: "1px solid #C8CBD0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          background: "#4F7B44",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Users size={18} color="white" />
      </div>
      <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>
        {label}
      </p>
    </div>
  );
}

function StoryCard({ label, image, videoUrl }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
          aspectRatio: "16/9",
          background: "#000",
        }}
      >
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title={label}
            width="100%"
            height="100%"
            style={{ border: "0" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <img
            src={image}
            alt={label}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
    </div>
  );
}

function OpportunityCard({
  title,
  commitment,
  location,
  description,
  responsibilities,
}) {
  const isRemote = commitment === "Flexible" && location === "Remote";
  const commitmentColor = isRemote ? "#507A7C" : "var(--color-primary)";
  const commitmentBg = isRemote ? "#EDF5F5" : "var(--color-primary-light)";

  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "1rem",
        padding: "1.25rem",
        background: "white",
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3
          style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827" }}
        >
          {title}
        </h3>
        <span
          style={{
            alignSelf: "flex-start",
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.25rem 0.625rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 500,
            background: commitmentBg,
            color: commitmentColor,
            whiteSpace: "nowrap",
          }}
        >
          <Clock size={11} />
          {commitment}
        </span>
      </div>
      <p style={{ fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.6 }}>
        {description}
      </p>
      <p style={{ fontSize: "0.8125rem", color: "#6B7280" }}>
        Location: {location}
      </p>
      <div style={{ marginTop: "0.25rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Responsibilities:
        </p>
        <ul style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {responsibilities.map((responsibility, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
                color: "#374151",
              }}
            >
              <CheckCircle
                size={14}
                style={{ color: "var(--color-primary)", flexShrink: 0 }}
              />
              {responsibility}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BenefitItem({ text, variant = "green" }) {
  const color =
    variant === "orange" ? "var(--color-btn-orange)" : "var(--color-primary)";

  return (
    <li
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.625rem",
        fontSize: "0.875rem",
        color: "#374151",
      }}
    >
      <CheckCircle
        size={16}
        style={{ color, flexShrink: 0, marginTop: "2px" }}
      />
      <span>{text}</span>
    </li>
  );
}

function FAQItem({ question, answer, open, onToggle }) {
  return (
    <div className="mx-auto w-full rounded-xl bg-white px-4 py-4 sm:px-5">
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: 0,
        }}
      >
        <span
          style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}
        >
          {question}
        </span>
        {open ? (
          <ChevronUp
            size={18}
            style={{ color: "var(--color-primary)", flexShrink: 0 }}
          />
        ) : (
          <ChevronDown size={18} style={{ color: "#9CA3AF", flexShrink: 0 }} />
        )}
      </button>
      {open ? (
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.875rem",
            color: "#6B7280",
            lineHeight: 1.65,
          }}
        >
          {answer}
        </p>
      ) : null}
    </div>
  );
}

export default function VolunteerPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Volunteer", path: "/volunteers" },
  ];

  return (
    <>
      <SEO
        title="Volunteer"
        description="Join our team of change-makers. Volunteers are essential to RUGAN's mission, delivering education, mentorship, and hope to girls."
        path="/volunteers"
        image="/images/volunteers/hero.jpg"
        pageType="AboutPage"
        breadcrumbs={breadcrumbs}
        faq={VOLUNTEER_FAQS}
        service={{
          name: "Volunteer opportunities",
          description:
            "Volunteer roles supporting school outreaches, community engagement, media storytelling, and programme operations for girls in rural communities.",
          serviceType: "Volunteer programme",
          audience: "Students, professionals, educators, and community advocates",
        }}
      />

      <PageHeroBanner
        title="Join Our Team of Change-Makers"
        subtitle="Volunteers are essential to RUGAN's mission, delivering education, mentorship, and hope to girls and underserved rural communities."
        backgroundImage="/images/volunteers/hero.jpg"
        breadcrumbs={breadcrumbs}
        centerText
        darkOverlay
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            justifyContent: "center",
            marginTop: "0.5rem",
          }}
        >
          {[
            { icon: Users, text: "70+ Active Volunteers" },
            { icon: Heart, text: "Make Real Impact" },
          ].map(({ icon: Icon, text }, index) => (
            <span
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(4px)",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "0.4rem 0.875rem",
                borderRadius: "9999px",
              }}
            >
              <Icon size={14} />
              {text}
            </span>
          ))}
        </div>
      </PageHeroBanner>

      <section className="section-padding" style={{ background: "#F9FAFB" }}>
        <div className="container-rugan">
          <SectionHeader
            title="Who Can Volunteer?"
            subtitle="Everyone with a passion for girl-child empowerment"
          />
          <motion.div
            className="mx-auto grid max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {VOLUNTEER_WHO.map((item, index) => (
              <motion.div key={index} variants={fadeUp}>
                <WhoCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-rugan">
          <SectionHeader
            title="Volunteer Stories"
            subtitle="Hear from those making a difference"
          />
          <div className="mx-auto grid max-w-[860px] grid-cols-1 gap-5">
            {VOLUNTEER_STORIES.map((story, index) => (
              <StoryCard key={index} {...story} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "#F9FAFB" }}>
        <div className="container-rugan">
          <SectionHeader
            title="Meet Our Amazing Volunteers"
            subtitle="Dedicated individuals from all walks of life, united by one mission: empowering girls"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {VOLUNTEER_PHOTOS.map((photo, index) => (
              <div
                key={index}
                style={{
                  aspectRatio: "1/1",
                  borderRadius: "0.875rem",
                  overflow: "hidden",
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 500ms ease",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "#E1EDDE" }}>
        <div className="container-rugan">
          <SectionHeader
            title="Volunteer Opportunities"
            subtitle="Find a role that matches your skills and interests."
          />
          <motion.div
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {VOLUNTEER_OPPORTUNITIES.map((opportunity, index) => (
              <motion.div key={index} variants={fadeUp}>
                <OpportunityCard {...opportunity} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-rugan">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div
              style={{
                background: "#F0FDF4",
                borderRadius: "1rem",
                padding: "clamp(1.25rem, 4vw, 2rem)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "1.25rem",
                }}
              >
                Benefits You Will Receive
              </h2>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {VOLUNTEER_BENEFITS.map((benefit, index) => (
                  <BenefitItem key={index} text={benefit} variant="green" />
                ))}
              </ul>
            </div>

            <div
              style={{
                background: "#FFF7ED",
                borderRadius: "1rem",
                padding: "clamp(1.25rem, 4vw, 2rem)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "1.25rem",
                }}
              >
                What We Expect
              </h2>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {VOLUNTEER_EXPECTATIONS.map((expectation, index) => (
                  <BenefitItem key={index} text={expectation} variant="orange" />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-padding"
        style={{ background: "var(--color-primary)" }}
      >
        <div className="container-rugan">
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                Apply to Volunteer
              </h2>
              <p
                style={{
                  marginTop: "0.5rem",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "1rem",
                }}
              >
                Take the first step towards making a difference.
              </p>
            </div>
            <div
              style={{
                background: "white",
                borderRadius: "1rem",
                padding: "clamp(1.25rem, 4vw, 2rem)",
              }}
            >
              <VolunteerForm />
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section-padding">
        <div className="container-rugan">
          <div className="mx-auto flex w-full max-w-[768px] flex-col gap-3 rounded-2xl bg-[#F9FAFB] px-4 py-6 sm:px-6 sm:py-8">
            <SectionHeader
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about volunteering with RUGAN"
            />
            {VOLUNTEER_FAQS.map((faq, index) => (
              <FAQItem
                key={index}
                {...faq}
                open={openFaqIndex === index}
                onToggle={() =>
                  setOpenFaqIndex(openFaqIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
