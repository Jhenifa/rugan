import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { motion } from "framer-motion";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  staggerContainer,
  scaleIn,
  viewportOnce,
} from "@/lib/motion";
import {
  TrendingUp,
  Bus,
  BookOpen,
  Globe,
  Leaf,
  Star,
  ShieldCheck,
  Lightbulb,
  CheckSquare,
  Heart,
  Package,
  ClipboardList,
} from "lucide-react";
import CTABanner from "@/components/common/CTABanner";
import SectionHeader from "@/components/ui/SectionHeader";

/* ── Timeline Data ── */
const TIMELINE = [
  {
    year: "2022",
    side: "left",
    title: 'RUGAN Founded as "The Girl & Nation STEAM"',
    description:
      "The organization was officially established with a mission to empower young girls and women through education.",
  },
  {
    year: "2022",
    side: "right",
    title: "RUGAN IDGC Project Launched",
    description:
      "Marked RUGAN’s first major advocacy and school outreach initiative, aligning the organization with the International Day of the Girl Child and strengthening awareness around girls’ rights, confidence, and leadership.",
  },
  {
    year: "2023",
    side: "left",
    title: "RUGAN Healthy-Period Project Launched",
    description:
      "Introduced structured menstrual and body health education in rural schools, helping girls understand their bodies, reduce stigma, and participate more confidently in school.",
  },
  {
    year: "2024",
    side: "right",
    title: "The Excellence Award launch",
    description:
      "Established a system to recognize and reward academic excellence among rural secondary school girls, motivating school retention and high academic performance.",
  },
  {
    year: "2025",
    side: "left",
    title: "The RISE Project Launched",
    description:
      "Introduced a focused programme for SS3 girls that provides guidance on life after secondary school, including educational and career pathways, to help them make informed choices and transition confidently into adulthood.",
  },
  {
    year: "2026",
    side: "right",
    title: "Rural-to-Global Programme Launching",
    description:
      "Upcoming programme highlighting rural-to-global success stories with mentorship and skills training pathways.",
  },
];

/* ── Focus Areas Data ── */
const FOCUS_AREAS = [
  {
    icon: Star,
    title: "Academic Excellence Recognition",
    description:
      "Recognizing and rewarding outstanding performance among secondary school girls in rural communities to promote academic achievement.",
    image: "/images/about/focus-excellence.jpg",
  },
  {
    icon: TrendingUp,
    title: "Leadership & Role Models",
    description:
      "Spotlighting women who have risen from rural backgrounds to become national and global leaders, inspiring ambition and possibility.",
    image: "/images/about/focus-leadership.jpg",
  },
  {
    icon: Bus,
    title: "School Empowerment Tours",
    description:
      "Age-appropriate empowerment sessions for all secondary school girls focused on confidence-building, leadership development, and personal growth.",
    image: "/images/about/focus-tours.jpg",
  },
  {
    icon: ClipboardList,
    title: "SS3 Life Guidance",
    description:
      "Specialized school tours for SS3 girls providing accurate guidance on life after secondary school and available educational, vocational, and career pathways.",
    image: "/images/about/focus-guidance.jpg",
  },
  {
    icon: Heart,
    title: "Menstrual & Body Health Education",
    description:
      "Comprehensive education that helps girls understand their bodies, reduce stigma, and manage menstruation with confidence.",
    image: "/images/about/focus-health.jpg",
  },
  {
    icon: Package,
    title: "Sanitary Pad Distribution",
    description:
      "Distribution of sanitary pads and essential menstrual resources in schools, ensuring girls can attend and participate with dignity.",
    image: "/images/about/focus-pads.jpg",
  },
];

/* ── Principles Data ── */
const PRINCIPLES = [
  {
    icon: Heart,
    title: "Empowerment",
    description:
      "Every rural girl has the right to gain confidence, knowledge, and skills to shape her future. At Rugan, We run leadership and confidence-building sessions, provide mentorship, and support girls with information and resources that help them make informed decisions and take control of their lives.",
    color: "orange",
  },
  {
    icon: BookOpen,
    title: "Education for All",
    description:
      "Education is a fundamental right and the most powerful tool for change, regardless of location or background. We recognize academic excellence through awards, provide school-based programmes, and encourage school retention through supportive initiatives like menstrual health education and resource distribution.",
    color: "green",
  },
  {
    icon: ShieldCheck,
    title: "Dignity",
    description:
      "Every girl deserves respect, privacy, and the ability to participate fully in school and society without shame or stigma. We teach girls about their bodies, provide menstrual products, and create safe spaces for discussion, ensuring girls can attend school with confidence and dignity.",
    color: "orange",
  },
  {
    icon: Globe,
    title: "Inclusion",
    description:
      "We are committed to reaching the most marginalized girls, ensuring that no girl is left behind because of her location, financial status, or social barriers. We prioritize rural communities, engage with schools and families, and design programmes that reach girls across all levels of secondary school.",
    color: "green",
  },
  {
    icon: Lightbulb,
    title: "Inspiration",
    description:
      "Role models and success stories can reshape a girl's belief in what is possible for her future. We share rural-to-global success stories, highlighting women who have become leaders and change-makers, and motivating girls to dream bigger.",
    color: "orange",
  },
  {
    icon: CheckSquare,
    title: "Integrity",
    description:
      "We operate with honesty, transparency, and accountability in all our programmes and partnerships. We deliver programmes with consistency, report openly to stakeholders, and ensure resources are used responsibly to benefit the girls we serve.",
    color: "green",
  },
  {
    icon: Leaf,
    title: "Resourcefulness",
    description:
      "At RUGAN, resourcefulness reflects our mindset of action and ingenuity. We do not wait for ideal conditions before making a difference. Instead, we make the most of the opportunities, knowledge, networks, and tools available to us to create meaningful impact within our community. It means thinking critically, approaching challenges with creativity, and taking proactive steps to solve problems and move our initiatives forward.",
    color: "orange",
  },
];

/* ── Focus Area Card ── */
function FocusAreaCard({ icon: Icon, title, description, image }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ aspectRatio: "16/10" }}
    >
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.0) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3"
          style={{ background: "#F0FDF4" }}
        >
          <Icon size={17} style={{ color: "#4F7B44" }} />
        </div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "white",
            marginBottom: "0.35rem",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── Principle Card ── */
function PrincipleCard({ icon: Icon, title, description, color }) {
  const isOrange = color === "orange";
  const iconBg = isOrange ? "#fff4ec" : "var(--color-primary-light)";
  const iconColor = isOrange
    ? "var(--color-btn-orange)"
    : "var(--color-primary)";

  return (
    <div className="rounded-2xl p-6" style={{ background: "white" }}>
      <div
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
        style={{ background: iconBg }}
      >
        <Icon size={19} style={{ color: iconColor }} />
      </div>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "#111827",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.65 }}>
        {description}
      </p>
    </div>
  );
}

/* ── Animated Timeline ── */
function AnimatedTimeline({ items }) {
  const containerRef = useRef(null);
  const [fillPercent, setFillPercent] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    setFillPercent(0);
  }, [pathname]);

  useEffect(() => {
    let maxReached = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalH = rect.height;

      const scrolled = Math.max(0, windowH * 0.6 - rect.top);
      const pct = Math.min(100, Math.max(0, (scrolled / totalH) * 100));

      if (pct > maxReached) {
        maxReached = pct;
        setFillPercent(pct);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", maxWidth: "860px", margin: "0 auto" }}
    >
      {/* Grey track */}
      <div
        className="hidden md:block absolute"
        style={{
          left: "50%",
          top: 0,
          bottom: 0,
          width: "2px",
          background: "#E5E7EB",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
      />

      {/* Orange fill — animates on scroll */}
      <div
        className="hidden md:block absolute"
        style={{
          left: "50%",
          top: 0,
          width: "2px",
          height: `${fillPercent}%`,
          background: "#D6670F",
          transform: "translateX(-50%)",
          transition: "height 80ms linear",
          zIndex: 1,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {items.map((item, i) => {
          const isLeft = item.side === "left";
          const dotActivated = fillPercent >= (i / (items.length - 1)) * 100;

          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                position: "relative",
              }}
            >
              {/* Left content */}
              <div style={{ paddingRight: "3rem" }}>
                {isLeft && (
                  <div
                    className="rounded-xl p-5"
                    style={{ border: "1px solid #E5E7EB", background: "white" }}
                  >
                    <span
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#D6670F",
                      }}
                    >
                      {item.year}
                    </span>
                    <h3
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "#111827",
                        margin: "0.35rem 0 0.5rem",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#6B7280",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Dot */}
              <div
                className="hidden md:flex absolute"
                style={{
                  left: "50%",
                  top: "1.25rem",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: dotActivated ? "#D6670F" : "#D1D5DB",
                  border: `3px solid ${dotActivated ? "#fff" : "#fff"}`,
                  boxShadow: dotActivated
                    ? "0 0 0 2px #D6670F"
                    : "0 0 0 2px #D1D5DB",
                  transition: "background 300ms, box-shadow 300ms",
                }}
              />

              {/* Right content */}
              <div style={{ paddingLeft: "3rem" }}>
                {!isLeft && (
                  <div
                    className="rounded-xl p-5"
                    style={{ border: "1px solid #E5E7EB", background: "white" }}
                  >
                    <span
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#D6670F",
                      }}
                    >
                      {item.year}
                    </span>
                    <h3
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "#111827",
                        margin: "0.35rem 0 0.5rem",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#6B7280",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Page ── */
export default function AboutPage() {
  return (
    <>
      {/* Founder Section */}
      <section className="section-padding">
        <div className="container-rugan">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.div
              variants={fadeLeft}
              className="rounded-2xl overflow-hidden"
              style={{ maxWidth: "420px", aspectRatio: "3/4" }}
            >
              <img
                src="/images/about/founder.jpg"
                alt="Fidel Nnadi"
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
            <div>
              <h1
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "1.25rem",
                }}
              >
                Meet Fidel Nnadi
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "#374151",
                    lineHeight: 1.75,
                  }}
                >
                  RUGAN (Rural Girl-Child Advancement Network) was founded by
                  <strong style={{ color: "#111827" }}> Fidel Nnadi</strong>, a
                  graduate of Social Work from the University of Nigeria,
                  Nsukka. The organization was originally launched as{" "}
                  <strong style={{ color: "#111827" }}>
                    "The Girl & Nation (TGAN)"
                  </strong>{" "}
                  in November 2022, born out of Fidel's passion to empower young
                  girls and women with the right resources needed to maximize
                  their full potential through education.
                </p>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "#374151",
                    lineHeight: 1.75,
                  }}
                >
                  Fidel believes that every young girl and woman can make, grow,
                  and thrive when they have access to quality education,
                  accessible information, mentorship, and practical resources
                  that empower young rural girls to develop confidence,
                  leadership skills, and independence.
                </p>
              </div>
              <a
                href="/team"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  marginTop: "2rem",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  textDecoration: "none",
                  transition: "opacity 200ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.75";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                View Full Team →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline of Impact */}
      <section className="section-padding" style={{ background: "#F9FAFB" }}>
        <div className="container-rugan">
          <SectionHeader
            title="Timeline of Impact (2022–2026)"
            subtitle="From our founding to today, every milestone represents lives changed and futures realigned."
          />
          <AnimatedTimeline items={TIMELINE} />
        </div>
      </section>

      {/* Our Focus Areas */}
      <section className="section-padding">
        <div className="container-rugan">
          <SectionHeader
            title="Our Focus Areas"
            subtitle="We concentrate our efforts on six critical areas to ensure holistic development for the girl-child"
          />
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 624px))",
              gap: "1.25rem",
              justifyContent: "center",
            }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {FOCUS_AREAS.map((area, i) => (
              <motion.div key={i} variants={scaleIn}>
                <FocusAreaCard {...area} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Principles That Guide Us */}
      <section className="section-padding" style={{ background: "#E1EDDE" }}>
        <div className="container-rugan">
          <SectionHeader
            title="The Principles That Guide Us"
            subtitle="Our values shape every decision we make and every programme we deliver"
          />
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 624px))",
              gap: "1.25rem",
              justifyContent: "center",
            }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {PRINCIPLES.map((p, i) => (
              <motion.div key={i} variants={fadeUp}>
                <PrincipleCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner
        title="Join Us in Empowering Rural Girls"
        subtitle="Your support helps us reach more girls, deliver more programmes, and inspire lasting change in rural communities across Nigeria."
        buttons={[
          {
            label: "Volunteer With Us",
            to: "/volunteers",
            variant: "volunteer",
          },
          { label: "Make a Donation", to: "/donate", variant: "primary" },
        ]}
      />
    </>
  );
}
