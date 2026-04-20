import PageHeroBanner from "../components/common/PageHeroBanner"
import CTABanner from "../components/common/CTABanner"
import { Users, Award, BarChart3, Target} from "lucide-react"
import SuccessStoryCard from "../components/common/SuccessStoryCard"
import IconFeatureCard from "../components/common/IconFeatureCard"
import PhotoGallery from "../components/common/PhotoGallery"
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, scaleIn, viewportOnce } from '@/lib/motion'
import SectionHeader from "../components/ui/SectionHeader"

export default function ImpactPage() {
  const images = [
    { src: "/images/impact/Image (Impact 2).png", alt: 'Outreach team with community members' },
    { src: "/images/impact/Image (Impact 3).png" },
    { src: "/images/impact/Image (Impact 4).png"},
    { src: "/images/impact/Image (Impact 6).png" },
    { src: "/images/impact/Image (Impact 7).png"},
    { src: "/images/impact/Image (Impact 8).png"},
  ]

  const stories = [
    {
      image: "/images/impact/Image (Grace).png",
      name: 'Grace',
      description: 'SS3 Student – Enugu State',
      quote: 'I now know I have choices, and I feel confident planning my future.',
      program: 'The RISE Project',
    },
    {
      image: "/images/impact/Image (Amina) (1).png",
      name: 'Amina',
      description: 'Junior Secondary Student – Abuja',
      quote: 'They made me believe my voice matters and I can.',
      program: 'IDGC Outreach',
    },
    {
      image: "/images/impact/Image (Chiamaka).png",
      name: 'Chiamaka',
      description: 'Secondary School Student – Anambra State',
      quote: 'I learned that leadership starts with confidence and speaking up, and it is not a must that I have a leadership position before.',
      program: 'IDGC Outreach',
    },
  ]

  const Growth = [
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
    description: "Programs Delivered",
  },
  {
    icon: Users,
    title: "70+",
    description: "Active Volunteers",
  },
]
  const Highlight = [
  {
    icon: Users,
    title: "IDGC Outreaches",
    stat:"1,465",
    description:"Girls reached across",
    bottomText:"six Nigeria States"
  },
  {
    icon:Target,
    title:"RISE Project",
    stat:"250+",
    description:"Students engaged", 
    bottomText:"(WAEC School Tour)"
  },
]

  function StatCard({ icon: Icon, title, description}) {
  return (
    <div className="bg-white rounded-[24px] px-8 py-8 shadow-sm border-t-4 border-b-4 border-[#4F7B44] min-h-[200px] flex flex-col gap-6">
      
      {/* Icon */}
      <div className="text-[#4F7B44]">
        <Icon size={42} strokeWidth={1.8} />
      </div>

      <h2 className="text-[56px] font-bold text-black leading-none">
        {title}
      </h2>

      <p className="text-[20px] text-gray-600 leading-snug">
        {description}
      </p>
    </div>
  );
}

function ImpactHighlight({ icon: Icon, title, stat, description, bottomText}) {
  return (
    <div className="flex min-h-[200px] items-center gap-5 border border-[#E5E7EB] rounded-[16px] bg-white px-8 py-7">
      
      {/* ICON */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E8F5E9]">
        <Icon size={22} color="#4F7B44" />
      </div>

      {/* TEXT */}
      <div className="flex flex-col gap-[2px]">
        
        {/* TITLE */}
        <h3 className="text-[35px] leading-[28px] font-bold text-[#4F7B44] py-2">
          {title}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-[15px] leading-[22px] text-[#6B7280] lineHeight-1.6">
          <span className="font-bold text-[#111827]">
            {stat}
          </span>{" "}
          {description}
        </p>
        <p>
          {bottomText}
        </p>

      </div>
    </div>
  );
}

  return (
    <div>
      <PageHeroBanner
        title="Our  Impact"
        subtitle="Measuring change, celebrating progress, and transforming lives one girl at a time."
        backgroundImage="/images/impact/Impact-hero.jpg"
        centerText
        darkOverlay
      />

      {/* IMPACT AT A GLANCE */}
      <section className="section-padding bg-white">
        <div className="container-rugan">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Impact at a Glance
            </h2>
            <p className="text-gray-500 mt-3">
              Year-over-year growth and achievements
            </p>
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {Growth.map((growth, i) => (
              <motion.div
                key={growth.id || i}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <StatCard {...growth} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

        {/* HIGHLIGHTS */}
      <section className=" section-padding py-20 px-4 bg-gray-50">
        <div className="container-rugan">
          <SectionHeader
            title="2025 Impact Highlights"
            subtitle="Milestones from our recent initiatives"
          />

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {Highlight.map((highlight, i) => (
              <ImpactHighlight key={i} {...highlight}/>
            ))}
          </div>
        </div>
      </section>

      <section className=" section-padding py-20 px-4 bg-white">
        <div className=" container-rugan ma x-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
             Success Stories
            </h2>
            <p className="text-gray-500 mt-3">
              Real girls, real transformations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <SuccessStoryCard key={index} {...story} />
            ))}
          </div>
        </div>
      </section>


      <section className="section-light-green section-padding">
        <div className="container-rugan">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Impact in Action
            </h2>
            <p className="text-gray-600 mt-3">
              Visual stories from the field
            </p>
          </div>

          <PhotoGallery
            images={images}
            bgColor="light-green"
            className="!p-0"
          />
        </div>
      </section>


      <div>
        <CTABanner
          title="Be Part of Our Impact Story"
          subtitle="Your support helps us create more success stories and reach more girls"
          buttons={[
            {
              label: 'Volunteer With Us',
              to: '/volunteers',
              variant: 'volunteer',
            },
            {
              label: 'Make a Donation',
              to: '/donate',
              variant: 'primary',
            },
          ]} 
        />
      </div>
    </div>
  )
}
