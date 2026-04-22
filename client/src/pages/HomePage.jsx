import PageHeroBanner from "../components/common/PageHeroBanner";
import Button from "../components/ui/Button";
import { Link } from "react-router";
import ProgramCard from "../components/common/ProgramCard";
import CTABanner from "../components/common/CTABanner";
import ChecklistItem from "../components/common/ChecklistItem";
import AnimatedCount from "../components/common/AnimatedCount";
import {
  Target,
  TrendingUp,
  Users,
  MapPin,
  Heart,
  Award,
} from "lucide-react";
import SectionHeader from "../components/ui/SectionHeader";

export default function HomePage() {
  const programs = [
    {
      title: "RUGAN IDGC School Tours",
      description:
        "Empowerment sessions in rural secondary schools to build confidence, leadership skills, self-belief and personal development.",
      image: "/images/programs/card-1.jpg",
      to: "/programs/idgc",
    },
    {
      title: "RUGAN Healthy Period Project",
      description:
        "Provides accurate menstrual and body health education, reduces stigma and distribute sanitary pads and essential resources.",
      image: "/images/programs/card-2.jpg",
      to: "/programs/period",
    },
    {
      title: "Excellence Awards",
      description:
        "Recognizes and rewards outstanding academic performance among rural secondary school girls to motivate excellence.",
      image: "/images/programs/card-3.jpg",
      to: "/programs/awards",
    },
    {
      title: "The RISE Project",
      description:
        "Provide SS3 girls with accurate information and guidance on life after secondary school, including educational vocational and career pathways.",
      image: "/images/programs/card-4.jpg",
      to: "/programs/rise",
    },
    {
      title: "Rural-to-Global Programme",
      description:
        "Highlights real-life stories of women who rose from rural backgrounds, while proving mentorship, skill training, and exposure pathways.",
      image: "/images/programs/card-5.jpg",
      to: "/programs/global",
    },
  ];

  const Impact = [
    { title: "4,750+", description: "Girls Reached", icon: Users },
    { title: "20+", description: "Communities Served", icon: MapPin },
    { title: "70+", description: "Active Volunteers", icon: Heart },
    { title: "20+", description: "Programmes Delivered", icon: Award },
    { title: "10+", description: "States in Nigeria", icon: Target },
  ];

  const challenges = [
    "Limited access to quality education",
    "Gender inequality and early marriage pressure",
    "Lack of mentorship and role models",
    "Inadequate menstrual health resources",
    "Restricted economic opportunities",
  ];

  const Mission = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "RUGAN exists to break down the barriers facing rural girl-children and women by providing access to quality education, life skills, mentorship, and practical resources that empower them to become self-reliant, confident, and impactful leaders.",
    },
    {
      icon: TrendingUp,
      title: "Our Vission",
      description:
        "A world where every rural girl has equal access to opportunities, can realize her full potential, and grows into a global leader who shapes her community and the world with confidence and purpose.",
    },
  ];

  function IconFeatureCard({
    title,
    description,
    icon: Icon,
    variant = "outlined",
  }) {
    const isFilled = variant === "filled";

    return (
      <div
        className={`rounded-[20px] p-8 flex flex-col gap-5 min-h-[260px] ${
          isFilled
            ? "bg-[#4F7B44] shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
            : "bg-white border border-[#E5E7EB] shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
        }`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            isFilled ? "bg-white/20" : "bg-[#4F7B44]"
          }`}
        >
          <Icon size={24} className="text-white" />
        </div>

        <h3
          className={`text-[22px] font-bold ${
            isFilled ? "text-white" : "text-[#111]"
          }`}
        >
          {title}
        </h3>

        <p
          className={`text-base leading-7 ${
            isFilled ? "text-[#E5E7EB]" : "text-[#6B7280]"
          }`}
        >
          {description}
        </p>
      </div>
    );
  }

  function StatCard({ icon: Icon, title, description }) {
    return (
      <div className="rounded-[20px] bg-[#F9FAFB] px-5 py-7 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#E6F0EA] flex items-center justify-center">
          <Icon size={26} className="text-[#4F7B44]" />
        </div>

        <AnimatedCount
          as="h2"
          value={title}
          className="text-[32px] font-bold text-[#4F7B44]"
        />

        <p className="text-[15px] text-[#6B7280]">{description}</p>
      </div>
    );
  }

  return (
    <div>
      {/* HERO */}
      <PageHeroBanner
        title={
          <h1 className="font-bold text-[60px] leading-[74px] tracking-[-1.2px] text-white max-w-[700px]">
            Empowering Rural Girls <br />
            to Become Tomorrow's <br />
            Leaders
          </h1>
        }

        subtitle={
          <p className="font-sans font-normal text-[22px] leading-[32px] tracking-[-0.5px] text-white py-5">
            Breaking down barriers facing rural girl-children through quality education, life skills, mentorship, and practical resources.
          </p>
        }
        backgroundImage="/images/homepage/Hero.jpg" className="h-[658px]"
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            as={Link}
            to="/donate"
            variant="primary"
            size="sm"
            className="w-full sm:w-auto"
          >
            Make a Donation
          </Button>

          <Button
            as={Link}
            to="/volunteers"
            variant="volunteer"
            size="sm"
            className="w-full sm:w-auto"
          >
            Volunteer with Us
          </Button>
        </div>
      </PageHeroBanner>

      {/* CHALLENGES */}
      <section className="section-padding bg-white">
        <div className="container-rugan flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          <div className="flex-1 max-w-xl w-full">
            <img
              src="/images/homepage/rural-girls-with-card.png"
              alt="Girls education and teaching"
              className="w-full h-[420px] sm:h-[550px] lg:h-[700px] object-cover rounded-2xl border border-[#e5e5e5] shadow-lg"
            />
          </div>

          <div className="flex-1 max-w-xl">
            <h1 className="font-bold text-2xl md:text-3xl mb-4 leading-tight">
              Breaking Down Barriers to Education
            </h1>

            <p className="text-[#555] leading-7 mb-6">
              Rural girl-children face persistant barriers to education,
              accurate information, mentorship, and economic empowerment.
              Poverty, gender inequality, early marriage, and limited community
              support restrict their opportunities and prevent them from
              building independent, impactful futures.
            </p>

            <div className="flex flex-col gap-4">
              {challenges.map((challenge, i) => (
                <ChecklistItem key={i} text={challenge} variant="plain" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section-padding">
        <div className="container-rugan text-center max-w-2xl mx-auto px-6">
          <SectionHeader
            title="Targeted School-Based Programmes"
            subtitle="RUGAN delivers comprehensive programs that support rural girls at different stages of their life journey, equipping them with knowledge, confidence, and practical support."
          />
        </div>

        <div className="mt-12 max-w-6xl mx-auto px-6 grid gap-6 md:grid-cols-3">
          {programs.slice(0, 3).map((program, i) => (
            <ProgramCard key={i} {...program} variant="overlay" />
          ))}

          <div className="md:col-span-3 grid gap-6 md:grid-cols-2">
            {programs.slice(3, 5).map((program, i) => (
              <ProgramCard key={i} {...program} variant="overlay" />
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section-padding bg-white">
        <div className="container-rugan">
          <SectionHeader
            title="Our Impact Across Nigeria"
            subtitle="Serving rural and underserved communities with targeted programs that create lasting grassroots impact"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-10">
            {Impact.map((impact, i) => (
              <StatCard key={i} {...impact} />
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="section-padding bg-gray-50 px-6">
        <div className="container-rugan grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Mission.map((item, i) => (
            <IconFeatureCard
              key={i}
              {...item}
              variant={i === 1 ? "filled" : "outlined"}
            />
          ))}
        </div>
      </section>

      {/* ACROSS NIGERIA */}
      <section className="section-padding bg-white">
        <div className="container-rugan flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 max-w-xl">
            <h1 className="font-bold text-3xl md:text-4xl mb-4">
              Serving Rural Nigeria
            </h1>

            <p className="text-[#555] leading-7 mb-6">
              RUGAN currently serves rural and underserved communities, with a
              focus on rural areas in Nigeria, working directly with
              girl-children, women, families, and community stakeholders to
              create lasting grassroots impact.
            </p>

            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="bg-[#E6F4EA] p-2 rounded-lg">
                  <MapPin size={20} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    <AnimatedCount value="10+" className="inline-block" />{" "}
                    States Reached
                  </h3>
                  <p className="text-sm text-[#777]">Across rural Nigeria</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-[#E6F4EA] p-2 rounded-lg">
                  <Users size={20} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    <AnimatedCount value="20+" className="inline-block" />{" "}
                    Communities
                  </h3>
                  <p className="text-sm text-[#777]">
                    Direct grassroots engagement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl w-full h-[350px] sm:h-[450px] lg:h-[500px]">
            <img
              src="/images/homepage/group-of-girls.png"
              alt="Girls education and teaching"
              className="w-full h-full object-cover rounded-2xl border border-[#e5e5e5] shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Join Us in Empowering Rural Girls"
        subtitle="Your support helps us to reach more girls, deliver more programs, and create lasting change in rural communities across Nigeria."
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
