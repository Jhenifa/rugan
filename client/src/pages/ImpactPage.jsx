
import PageHeroBanner from "../components/common/PageHeroBanner"
import CTABanner from "../components/common/CTABanner"
import { Users, Award, BarChart3, Target} from "lucide-react"
import SuccessStoryCard from "../components/common/SuccessStoryCard"
import IconFeatureCard from "../components/common/IconFeatureCard"
import PhotoGallery from "../components/common/PhotoGallery"


export default function ImpactPage() {
  const images = [
    { src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop", alt: 'Outreach team with community members' },
    { src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop"},
    { src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop"},
    { src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop"},
  ]

  const stories = [
    {
      image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
      name: 'Grace',
      description: 'SS3 Student – Enugu State',
      quote: 'I now know I have choices, and I feel confident planning my future.',
      program: 'The RISE Project',
    },
    {
      image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
      name: 'Amina',
      description: 'Junior Secondary Student – Abuja',
      quote: 'They made me believe my voice matters and I can.',
      program: 'IDGC Outreach',
    },
    {
      image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
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

  function StatCard({ icon: Icon, title, description }) {
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


  return (
    <div>
      <PageHeroBanner
        title="Our  Impact"
        subtitle="Measuring change, celebrating progress, and transforming lives one girl at a time."
        backgroundImage="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop"
      />

      {/* IMPACT AT A GLANCE */}
      <section className="section-padding bg-white">
        <div className=" container-rugan">
        <div className=" text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Impact at a Glance
          </h2>
          <p className="text-gray-500 mt-3">
            Year-over-year growth and achievements
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {Growth.map((growth, i) => (
              <StatCard key={i} {...growth} />
            ))}
        </div>
        </div>
      </section>

        {/* HIGHLIGHTS */}
      <section className=" section-padding py-20 px-4 bg-gray-50">
      <div className="container-rugan">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            2025 Impact Highlights
          </h2>
          <p className="text-gray-500 mt-3">
            Milestones from our recent initiatives
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          <IconFeatureCard
            icon={Users}
            title="IDGC Outreaches"
            description={
              <>
                <span className="font-bold text-gray-900">
                  1,465
                </span>{' '}
                Girls reached across <br />
                six Nigerian States
              </>
            }
          />

          <IconFeatureCard
            icon={Target}
            title="RISE Project"
            description={
              <>
               <span className="font-semibold text-gray-900">
                  250+
                </span>{' '}
                Students engaged <br />
                (WAEC School Tour)
              </>
            }
          />
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
