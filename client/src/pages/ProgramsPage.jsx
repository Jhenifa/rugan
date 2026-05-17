import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import ProgramCard from "@/components/common/ProgramCard";
import CTABanner from "@/components/common/CTABanner";
import { PROGRAMME_LIST } from "@/data/programmes";

import SEO from "@/components/SEO";

export default function ProgramsPage() {
  return (
    <>
      <SEO
        title="Our Programmes"
        description="Comprehensive initiatives designed to empower girl-children and create lasting change in communities."
        path="/programmes"
        pageType="CollectionPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Programmes", path: "/programmes" },
        ]}
      />
      <PageHeroBanner
        title="Our Programmes"
        subtitle="Comprehensive initiatives designed to empower girl-children and create lasting change in communities"
        backgroundImage="/images/programs/programs-hero.jpg"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Programmes", path: "/programmes" },
        ]}
        centerText
        darkOverlay
      />

      <section className="section-padding">
        <div className="container-rugan">
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {PROGRAMME_LIST.map((programme) => (
              <motion.div
                key={programme.slug}
                variants={fadeUp}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <ProgramCard
                  image={programme.cardImage}
                  title={programme.cardTitle}
                  description={programme.teaser}
                  to={`/programmes/${programme.slug}`}
                  variant="plain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner
        title="Want to Support Our Programmes?"
        subtitle="Your contribution helps us reach more girls and expand our impact."
        buttons={[
          { label: "Make a Donation", to: "/donate", variant: "primary" },
          {
            label: "Become a Partner",
            to: "/partnership",
            variant: "volunteer",
          },
        ]}
      />
    </>
  );
}
