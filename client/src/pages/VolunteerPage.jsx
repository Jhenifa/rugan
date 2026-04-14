import { motion } from "framer-motion";
import { fadeUp, staggerContainer, scaleIn, viewportOnce } from "@/lib/motion";
import { useState } from "react";
import {
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
} from "lucide-react";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import SectionHeader from "@/components/ui/SectionHeader";
import VolunteerForm from "@/components/forms/VolunteerForm";

/* ── Who Can Volunteer ── */
const WHO = [
  { label: "Students & Young Professionals" },
  { label: "Educators & Outreach" },
  { label: "Community Advocates" },
  { label: "Committed Individuals" },
];

/* ── Volunteer Stories ── */
const STORIES = [
  {
    label: "Why I Volunteer",
    videoUrl:
      "https://drive.google.com/file/d/1jGrmnudMv3iBhIyuOhdb8vIIZpfS6SLV/preview",
  },
];

/* ── Volunteer Photo Grid ── */
const VOLUNTEER_PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/volunteers/vol-${i + 1}.jpg`,
  alt: `Volunteer ${i + 1}`,
}));

/* ── Opportunities ── */
const OPPORTUNITIES = [
  {
    title: "Programme Manager Volunteer",
    commitment: "Flexible (Project-based)",
    location: "On-site (Nigeria)",
    description: "Supports implementation of school outreaches and workshops.",
    responsibilities: [
      "Coordinate outreach logistics",
      "Supervise field activities",
      "Report on programme outcomes",
    ],
  },
  {
    title: "Community Outreach Volunteer",
    commitment: "5–10 hours/month",
    location: "On-site or Hybrid",
    description:
      "Assists with mobilization and coordination in local communities.",
    responsibilities: [
      "Mobilize community members",
      "Support event setup",
      "Engage with participants",
    ],
  },
  {
    title: "Content & Media Volunteer",
    commitment: "Flexible",
    location: "Remote",
    description:
      "Supports documentation and storytelling for our digital platforms.",
    responsibilities: [
      "Create social media content",
      "Document events (photos/videos)",
      "Write blog posts",
    ],
  },
];

/* ── Benefits & Expectations ── */
const BENEFITS = [
  "Make a meaningful difference in girls' lives",
  "Gain leadership and mentoring experience",
  "Connect with like-minded changemakers",
  "Access to training and development programmes",
  "Receive a RUGAN volunteering certificate",
  "Flexible scheduling options",
];

const EXPECTATIONS = [
  "Commitment to RUGAN's mission and values",
  "Regular attendance and punctuality",
  "Professional conduct at all times",
  "Respect for confidentiality",
  "Completion of required training",
  "Open to feedback and continuous learning",
];

/* ── FAQ ── */
const FAQS = [
  {
    question: "Do I need prior experience to volunteer?",
    answer:
      "No, prior experience is not mandatory. At RUGAN, we welcome individuals who are passionate about advancing the rural girl child. While some roles (such as content creation, project coordination, or mentorship) may benefit from prior experience, we also have entry-level opportunities. What matters most is your commitment, willingness to learn, and alignment with our mission. We provide guidance and orientation to help you succeed in your role.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "We understand that volunteers have different schedules. Most roles require a minimum commitment of 3–5 hours per week, depending on the project or department. For event-based or campaign-specific roles, time commitments may be flexible and short-term. We encourage consistency, as our programmes support rural girls who depend on structured and reliable support.",
  },
  {
    question: "Can I volunteer remotely?",
    answer:
      "Yes, we offer both remote and on-site volunteer opportunities. Remote roles include: Social media management, Content writing, Graphic design, Research and data support, Fundraising and partnership outreach, On-site roles are available for: Community outreach, School programmes, Field projects, Mentorship sessions.You can indicate your preference during the application process.",
  },
  {
    question: "What is the application process?",
    answer:
      "Our application process is simple: Complete the volunteer application form, shortlisting and review by our team, a brief virtual interview (if required), onboarding and orientation session, role assignment and project briefing. We aim to make the process smooth and transparent while ensuring volunteers are placed in roles that align with their skills and interests.",
  },
  {
    question: "Are there age requirements for volunteers?",
    answer:
      "Yes. Volunteers must be at least 18 years old. However, individuals under 18 may participate in selected programmes or community initiatives with parental/guardian consent. We encourage youth participation, especially those passionate about education, leadership, and advocacy for the rural girl child.",
  },
];

/* ── Sub-components ── */

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
        }}
      >
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title={label}
            width="100%"
            height="100%"
            style={{ border: "0" }}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; subtitles; captions"
            allowFullScreen
          />
        ) : (
          <img
            src={image}
            alt={label}
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
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <h3
          style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827" }}
        >
          {title}
        </h3>
        <span
          style={{
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
          {responsibilities.map((r, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
                color: "#374151",
              }}
            >
              <CheckCircle2
                size={14}
                style={{ color: "var(--color-primary)", flexShrink: 0 }}
              />
              {r}
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
      <CheckCircle2
        size={16}
        style={{ color, flexShrink: 0, marginTop: "2px" }}
      />
      <span>{text}</span>
    </li>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        width: "720px",
        maxWidth: "100%",
        background: "white",
        borderRadius: "0.75rem",
        padding: "1rem 1.25rem",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
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
      {open && (
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
      )}
    </div>
  );
}

/* ── Page ── */
export default function VolunteerPage() {
  return (
    <>
      {/* Hero */}
      <PageHeroBanner
        title="Join Our Team of Change-Makers"
        subtitle="Volunteers are essential to RUGAN’s mission, delivering education, mentorship, and hope to girls and underserved rural communities."
        backgroundImage="/images/volunteers/hero.jpg"
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
          ].map(({ icon: Icon, text }, i) => (
            <span
              key={i}
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

      {/* Who Can Volunteer */}
      <section className="section-padding" style={{ background: "#F9FAFB" }}>
        <div className="container-rugan">
          <SectionHeader
            title="Who Can Volunteer?"
            subtitle="Everyone with a passion for girl-child empowerment"
          />
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.875rem",
              maxWidth: "860px",
              margin: "0 auto",
            }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {WHO.map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <WhoCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Volunteer Stories */}
      <section className="section-padding">
        <div className="container-rugan">
          <SectionHeader
            title="Volunteer Stories"
            subtitle="Hear from those making a difference"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1.25rem",
              maxWidth: "860px",
              margin: "0 auto",
            }}
          >
            {STORIES.map((s, i) => (
              <StoryCard key={i} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Amazing Volunteers */}
      <section className="section-padding" style={{ background: "#F9FAFB" }}>
        <div className="container-rugan">
          <SectionHeader
            title="Meet Our Amazing Volunteers"
            subtitle="Dedicated individuals from all walks of life, united by one mission: empowering girls"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.875rem",
            }}
          >
            {VOLUNTEER_PHOTOS.map((photo, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1/1",
                  borderRadius: "0.875rem",
                  overflow: "hidden",
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 500ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="section-padding" style={{ background: "#E1EDDE" }}>
        <div className="container-rugan">
          <SectionHeader
            title="Volunteer Opportunities"
            subtitle="Find a role that matches your skills and interests."
          />
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {OPPORTUNITIES.map((opp, i) => (
              <motion.div key={i} variants={fadeUp}>
                <OpportunityCard {...opp} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits & Expectations */}
      <section className="section-padding">
        <div className="container-rugan">
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Benefits */}
            <div
              style={{
                width: "480px",
                maxWidth: "100%",
                background: "#F0FDF4",
                borderRadius: "1rem",
                padding: "1.75rem 2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "1.25rem",
                }}
              >
                Benefits You Will Receive
              </h3>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {BENEFITS.map((b, i) => (
                  <BenefitItem key={i} text={b} variant="green" />
                ))}
              </ul>
            </div>
            {/* Expectations */}
            <div
              style={{
                width: "480px",
                maxWidth: "100%",
                background: "#FFF7ED",
                borderRadius: "1rem",
                padding: "1.75rem 2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "1.25rem",
                }}
              >
                What We Expect
              </h3>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {EXPECTATIONS.map((e, i) => (
                  <BenefitItem key={i} text={e} variant="orange" />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Apply to Volunteer */}
      <section
        className="section-padding"
        style={{ background: "var(--color-primary)" }}
      >
        <div className="container-rugan" style={{ maxWidth: "720px" }}>
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
              padding: "2rem",
            }}
          >
            <VolunteerForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding">
        <div className="container-rugan">
          <div
            style={{
              width: "768px",
              maxWidth: "100%",
              margin: "0 auto",
              background: "#F9FAFB",
              borderRadius: "1rem",
              padding: "2rem 1.5rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <SectionHeader
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about volunteering with RUGAN"
            />
            {FAQS.map((faq, i) => (
              <FAQItem key={i} {...faq} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
