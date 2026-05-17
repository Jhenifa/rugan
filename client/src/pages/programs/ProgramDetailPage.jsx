import { motion } from "framer-motion";
import { useParams } from "react-router";
import SEO from "@/components/SEO";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import ChecklistItem from "@/components/common/ChecklistItem";
import CTABanner from "@/components/common/CTABanner";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/motion";
import { PROGRAMMES } from "@/data/programmes";

function PathwayCard({ number, name, description, target }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-6"
      style={{ border: "1px solid var(--color-border)", background: "white" }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: "8px",
          background: "#FFF7F0",
          fontSize: "1.125rem",
          fontWeight: 700,
          color: "#507A7C",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
        {name}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-muted)",
          lineHeight: 1.65,
          flex: 1,
        }}
      >
        {description}
      </p>
      <div
        style={{
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#507A7C",
            marginBottom: "0.25rem",
          }}
        >
          Target Group:
        </p>
        <p style={{ fontSize: "0.8125rem", color: "#374151" }}>{target}</p>
      </div>
    </div>
  );
}

export default function ProgramDetailPage() {
  const { slug } = useParams();
  const programme = PROGRAMMES[slug];

  if (!programme) {
    return (
      <div className="container-rugan section-padding text-center">
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#111827" }}>
          Programme not found.
        </h1>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Programmes", path: "/programmes" },
    {
      name: programme.cardTitle || programme.title,
      path: `/programmes/${programme.slug}`,
    },
  ];

  return (
    <>
      <SEO
        title={programme.title}
        description={programme.overview}
        image={programme.heroImage}
        path={`/programmes/${slug}`}
        pageType="WebPage"
        keywords={[
          "RUGAN programmes",
          "rural girls empowerment",
          "girls education projects",
          "nonprofit initiatives",
        ]}
        breadcrumbs={breadcrumbs}
        service={{
          name: programme.cardTitle || programme.title,
          description: programme.overview,
          serviceType: "Girls empowerment programme",
          audience: "Girls in rural and underserved communities",
        }}
      />

      <PageHeroBanner
        title={programme.title}
        subtitle={programme.subtitle}
        backgroundImage={programme.heroImage}
        breadcrumbs={breadcrumbs}
        backLink={{ to: "/programmes", label: "Back to Programmes" }}
        darkOverlay
      />

      <section className="section-padding" style={{ background: "#EBEBEB" }}>
        <div className="container-rugan">
          <div style={{ maxWidth: "780px", margin: "0 auto" }}>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              style={{
                fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              Programme Overview
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              style={{
                fontSize: "0.9375rem",
                color: "#374151",
                lineHeight: 1.75,
                textAlign: "left",
              }}
            >
              {programme.overview}
            </motion.p>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "#FAFAFA" }}>
        <div className="container-rugan">
          <SectionHeader title="Key Activities" />
          <motion.div
            className="mx-auto grid max-w-[1272px] grid-cols-1 items-stretch gap-4 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {programme.activities.map((activity, index) => (
              <motion.div key={index} variants={fadeUp}>
                <ChecklistItem text={activity} variant="card" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {programme.pathways ? (
        <section className="section-padding" style={{ background: "#FFF7F0" }}>
          <div className="container-rugan">
            <SectionHeader
              title="Three Interconnected Pathways"
              subtitle="The Rural to Global Programme operates through three complementary pathways, each targeting different stages of the journey from rural communities to global opportunities."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {programme.pathways.map((pathway, index) => (
                <PathwayCard key={index} {...pathway} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-padding" style={{ background: "#E1EDDE" }}>
        <div className="container-rugan">
          <SectionHeader title="Programme Gallery" />
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {programme.gallery.map((image, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="aspect-square overflow-hidden rounded-2xl"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner
        title="Support This Programme"
        subtitle="Your contribution can help us expand this programme and reach more girls."
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
