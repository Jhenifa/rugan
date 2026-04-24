import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, BarChart3, Heart, Target, Users } from "lucide-react";
import CTABanner from "../components/common/CTABanner";
import SuccessStoryCard from "../components/common/SuccessStoryCard";
import AnimatedCount from "../components/common/AnimatedCount";
import PageHeroBanner from "../components/common/PageHeroBanner";
import SectionHeader from "../components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const IMAGES = [
  {
    src: "/images/impact/Image (Impact 2).png",
    alt: "Outreach team with community members",
  },
  { src: "/images/impact/Image (Impact 3).png" },
  { src: "/images/impact/Image (Impact 4).png" },
  { src: "/images/impact/Image (Impact 6).png" },
  { src: "/images/impact/Image (Impact 7).png" },
  { src: "/images/impact/Image (Impact 8).png" },
];

const STORIES = [
  {
    image: "/images/impact/Image (Grace).png",
    name: "Grace",
    description: "SS3 Student - Enugu State",
    quote:
      "I now know I have choices, and I feel confident planning my future.",
    program: "The Rise Project",
  },
  {
    image: "/images/impact/Image (Amina) (1).png",
    name: "Amina",
    description: "Junior Secondary Student - Abuja",
    quote: "They made me believe my voice matters and I can.",
    program: "IDGC Outreach",
  },
  {
    image: "/images/impact/Image (Chiamaka).png",
    name: "Chiamaka",
    description: "Secondary School Student - Anambra State",
    quote:
      "I learned that leadership starts with confidence and speaking up, and it is not a must that I have a leadership position before.",
    program: "IDGC Outreach",
  },
];

const GROWTH = [
  {
    icon: Users,
    title: "4,750+",
    description: "Total Girls Reached",
  },
  {
    icon: Award,
    title: "20+",
    description: "Communities Served",
  },
  {
    icon: BarChart3,
    title: "20+",
    description: "Programmes Delivered",
  },
  {
    icon: Users,
    title: "70+",
    description: "Active Volunteers",
  },
];

const HIGHLIGHTS = [
  {
    icon: Heart,
    title: "RUGAN Healthy Period Project",
    stat: "1,005+",
    description: "Girls empowered with menstrual health education",
    iconShape: "circle",
  },
  {
    icon: Users,
    title: "IDGC Outreaches",
    stat: "2153+",
    description: "Girls reached across Nigerian States",
    iconShape: "circle",
  },
  {
    icon: Award,
    title: "Excellence Award Project",
    stat: "157+",
    description: "Students recognized for academic excellence",
    iconShape: "circle",
  },
  {
    icon: Target,
    title: "RISE Project",
    stat: "501+",
    description: "Students engaged in career development",
    iconShape: "circle",
  },
];

function StatCard({ icon: Icon, title, description, isCountActive }) {
  return (
    <div className="relative flex h-full w-full min-h-[118px] flex-col gap-2 overflow-hidden rounded-[18px] bg-white px-3.5 py-3.5 sm:min-h-[168px] sm:gap-3 sm:rounded-[22px] sm:px-7 sm:py-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[12px] sm:h-[16px]">
        <div className="h-full w-full rounded-t-[18px] border-t-[3px] border-[#5A8A50] sm:rounded-t-[22px] sm:border-t-[4px]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[12px] sm:h-[16px]">
        <div className="h-full w-full rounded-b-[18px] border-b-[3px] border-[#5A8A50] sm:rounded-b-[22px] sm:border-b-[4px]" />
      </div>

      <div className="pt-0.5 text-[#4F7B44] sm:pt-1">
        <Icon size={22} strokeWidth={1.8} className="sm:h-[30px] sm:w-[30px]" />
      </div>

      <AnimatedCount
        as="h2"
        value={title}
        isActive={isCountActive}
        className="text-[22px] font-semibold leading-[1.05] text-[#111827] sm:text-[32px] sm:leading-[1.1]"
      />

      <p className="text-[11px] leading-[1.35] text-[#4B5563] sm:text-[15px] sm:leading-[1.45]">
        {description}
      </p>
    </div>
  );
}

function ImpactHighlight({
  icon: Icon,
  title,
  stat,
  description,
  iconShape = "circle",
  isCountActive,
}) {
  const isSquare = iconShape === "square";

  return (
    <div className="flex h-full flex-col items-start gap-4 rounded-[16px] border border-[#98A2B3] bg-white px-5 py-5 sm:min-h-[146px] sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-7">
      <div
        className={`flex shrink-0 items-center justify-center bg-[#DCFCE7] ${
          isSquare ? "h-[58px] w-[58px] rounded-[16px]" : "h-[58px] w-[58px] rounded-full"
        }`}
      >
        <Icon size={30} color="#4F7B44" strokeWidth={1.9} />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-[20px] font-bold leading-[1.2] text-[#4F7B44] sm:text-[22px]">
          {title}
        </h3>

        <p className="text-[14px] leading-[1.55] text-[#4B5563] sm:text-[15px]">
          <AnimatedCount
            value={stat}
            isActive={isCountActive}
            className="inline-block text-[16px] font-bold text-[#111827] sm:text-[17px]"
          />{" "}
          {description}
        </p>
      </div>
    </div>
  );
}

export default function ImpactPage() {
  const growthSectionRef = useRef(null);
  const highlightSectionRef = useRef(null);
  const isGrowthSectionInView = useInView(growthSectionRef, {
    once: true,
    amount: 0.2,
  });
  const isHighlightSectionInView = useInView(highlightSectionRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <div>
      <PageHeroBanner
        title="Our Impact"
        subtitle="Measuring change, celebrating progress, and transforming lives one girl at a time."
        backgroundImage="/images/impact/Impact-hero.jpg"
        centerText
        darkOverlay
      />

      <section ref={growthSectionRef} className="section-padding bg-white">
        <div className="container-rugan">
          <SectionHeader
            title="Impact at a Glance"
            subtitle="Year-over-year growth and achievements"
            className="mx-auto max-w-2xl"
          />

          <motion.div
            className="mx-auto grid max-w-6xl grid-cols-2 justify-items-center gap-2.5 sm:gap-4 lg:grid-cols-4 lg:gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {GROWTH.map((growth, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="w-full max-w-[155px] sm:max-w-none"
              >
                <StatCard {...growth} isCountActive={isGrowthSectionInView} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={highlightSectionRef}
        className="section-padding bg-[#FAFAFA]"
      >
        <div className="container-rugan">
          <SectionHeader
            title="Impact Highlights"
            subtitle="Milestones from our recent initiatives"
            className="mx-auto max-w-2xl"
          />

          <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-2">
            {HIGHLIGHTS.map((highlight, i) => (
              <ImpactHighlight
                key={i}
                {...highlight}
                isCountActive={isHighlightSectionInView}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-rugan">
          <SectionHeader
            title="Success Stories"
            subtitle="Real girls, real transformations"
            className="mx-auto max-w-2xl"
          />

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {STORIES.map((story, index) => (
              <SuccessStoryCard key={index} {...story} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#F0FDF4]">
        <div className="container-rugan">
          <SectionHeader
            title="Impact in Action"
            subtitle="Visual stories from the field"
            className="mx-auto max-w-2xl"
          />

          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {IMAGES.map((image, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="aspect-square overflow-hidden rounded-2xl"
              >
                <img
                  src={image.src}
                  alt={image.alt || `Impact gallery image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner
        title="Be Part of Our Impact Story"
        subtitle="Your support helps us create more success stories and reach more girls"
        buttons={[
          {
            label: "Volunteer With Us",
            to: "/volunteers",
            variant: "volunteer",
          },
          {
            label: "Make a Donation",
            to: "/donate",
            variant: "primary",
          },
        ]}
      />
    </div>
  );
}
