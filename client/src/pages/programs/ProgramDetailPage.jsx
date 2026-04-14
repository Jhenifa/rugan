import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, scaleIn, viewportOnce } from '@/lib/motion'
import { useParams } from 'react-router'
import PageHeroBanner  from '@/components/common/PageHeroBanner'
import ChecklistItem   from '@/components/common/ChecklistItem'
import CTABanner       from '@/components/common/CTABanner'
import SectionHeader   from '@/components/ui/SectionHeader'

/* ─────────────────────────────────────────────
   Programme Data
   Images reference /public/images/programs/<folder>/
   Swap in real filenames as assets are added.
───────────────────────────────────────────── */
const PROGRAMS = {
  'rugan-idgc-school-tours': {
    title:           'RUGAN IDGC Project',
    subtitle:        "Girls' Rights, Education Advocacy, and Visibility",
    heroImage:       '/images/programs/idgc/hero.jpg',
    overview:        'The International Day for the Girl Child (IDGC) Programme is an annual advocacy and outreach initiative that commemorates the global observance of the International Day for the Girl Child. Through school-based outreaches and community engagements, the programme amplifies the voices of girls, promotes their rights, and reinforces the importance of education, leadership, and self-worth.',
    activities: [
      'School and community outreaches annually in October',
      'Interactive sessions on girls\' rights, leadership, education, and self-belief',
      'Mentorship and motivational talks with girls and young people',
      'Engagement with schools, teachers, and community stakeholders',
    ],
    gallery: [
      { src: '/images/programs/idgc/gallery-1.jpg', alt: 'Girls holding advocacy signs' },
      { src: '/images/programs/idgc/gallery-2.jpg', alt: 'School group outreach' },
      { src: '/images/programs/idgc/gallery-3.jpg', alt: 'Girls with colourful placards' },
      { src: '/images/programs/idgc/gallery-4.jpg', alt: 'Girl speaking into microphone' },
      { src: '/images/programs/idgc/gallery-5.jpg', alt: 'Large community gathering' },
      { src: '/images/programs/idgc/gallery-6.jpg', alt: '"Your Voice Matters" sign' },
    ],
  },

  'rugan-healthy-period-project': {
    title:           'RUGAN Healthy Period Project',
    subtitle:        'Menstrual Health Education, Period Dignity, and Policy Advocacy',
    heroImage:       '/images/programs/healthy-period/hero.jpg',
    overview:        'The RUGAN Healthy Period Project addresses period poverty, stigma, and misinformation in schools, especially in rural and low-resource areas. Beyond distributing sanitary materials, the project educates girls about menstrual cycles, premenstrual syndrome (PMS), postmenstrual symptoms, endometriosis, reproductive health, and fertility connections, helping them understand and manage menstruation holistically. The project also advocates for pad banks, inclusive school policies, and the elimination of stigmatisation and discrimination associated with menstruation.',
    activities: [
      'Menstrual health education workshops covering facts vs myths about menstruation',
      'Education on PMS and postmenstrual symptoms',
      'Teaching menstrual cycle and reproductive health connections',
      'Endometriosis awareness sessions',
      'Distribution of sanitary pads and hygiene kits',
      'Distribution of sanitary pads and hygiene kits',
      'Community sensitisation to combat stigmatisation and stereotypes',
    ],
    gallery: [
      { src: '/images/programs/healthy-period/gallery-1.jpg', alt: 'Team with sanitary supplies' },
      { src: '/images/programs/healthy-period/gallery-2.jpg', alt: 'Facilitator presenting to students' },
      { src: '/images/programs/healthy-period/gallery-3.jpg', alt: 'Girls celebrating with pads' },
      { src: '/images/programs/healthy-period/gallery-4.jpg', alt: 'Community donors and team' },
      { src: '/images/programs/healthy-period/gallery-5.jpg', alt: 'RUGAN classroom session' },
      { src: '/images/programs/healthy-period/gallery-6.jpg', alt: 'Girls holding sanitary kits' },
    ],
  },

  'the-rise-project': {
    title:           'The RISE Project',
    subtitle:        'Resilient, Inspired, Skilled, Empowered',
    heroImage:       '/images/programs/rise/hero.jpg',
    overview:        'The RISE Project (Resilient, Inspired, Skilled, Empowered) supports senior secondary school students, especially girls, as they transition from school to further education, vocational training, or entrepreneurship. It equips students with the skills, guidance, and confidence to make informed life decisions after secondary school.',
    activities: [
      'WAEC School Tours and mentorship sessions',
      'Guidance on post-secondary options: higher education, vocational training, entrepreneurship',
      'Life skills workshops: resilience, goal-setting, and personal development',
    ],
    gallery: [
      { src: '/images/programs/rise/gallery-1.jpg', alt: 'Students at group session' },
      { src: '/images/programs/rise/gallery-2.jpg', alt: 'Girl listening attentively' },
      { src: '/images/programs/rise/gallery-3.jpg', alt: 'Classroom mentorship session' },
      { src: '/images/programs/rise/gallery-4.jpg', alt: 'Students with RUGAN banners' },
      { src: '/images/programs/rise/gallery-5.jpg', alt: 'Student addressing the class' },
      { src: '/images/programs/rise/gallery-6.jpg', alt: 'Large school hall session' },
    ],
  },

  'excellence-award-project': {
    title:           'Excellence Award Project',
    subtitle:        'Education, Motivation, and Positive Reinforcement',
    heroImage:       '/images/programs/excellence-award/hero.jpg',
    overview:        'The Excellence Award Project recognises and celebrates academic achievement among girls in secondary school, particularly in response to the declining appreciation of education in Nigeria. By highlighting effort, discipline, and resilience, the project aims to restore respect for learning and encourage a culture of excellence.',
    activities: [
      'Awarding outstanding students in secondary school',
      'Celebrating girls finishing secondary education and those still in school',
      'Public recognition of achievement to motivate peers',
      'Messages reinforcing the importance of education',
    ],
    gallery: [
      { src: '/images/programs/excellence-award/gallery-1.jpg', alt: 'Award ceremony with dignitaries' },
      { src: '/images/programs/excellence-award/gallery-2.jpg', alt: 'School audience at ceremony' },
      { src: '/images/programs/excellence-award/gallery-3.jpg', alt: 'Award recipient with certificate' },
      { src: '/images/programs/excellence-award/gallery-4.jpg', alt: 'Group photo at awards' },
      { src: '/images/programs/excellence-award/gallery-5.jpg', alt: 'Another award recipient' },
      { src: '/images/programs/excellence-award/gallery-6.jpg', alt: 'Student science project display' },
    ],
  },

  'rural-to-global-programme': {
    title:           'Rural to Global Programme',
    subtitle:        'Opportunity Access, Skills Development, Mentorship, and Global Citizenship',
    heroImage:       '/images/programs/rural-to-global/hero.jpg',
    overview:        'The Rural to Global Programme is a transformational initiative designed to bridge the gap between rural disadvantage and global opportunity. It operates through three interconnected pathways: Rural to Global Spotlight, Rural to Global Fellowship, and the Rural to Global Bootcamp. Together, these pathways identify, celebrate, and equip young people from underserved rural communities to overcome structural barriers and access opportunities at national and global levels.',
    activities: [
      'Rural to Global Spotlight features highlighting rural-to-global success stories',
      'Application-based selection of Rural to Global Fellows',
      'Three-month mentorship programme with skills training and opportunity access',
      'Scholarship support for learning and capacity development',
      'One-week intensive Bootcamps for younger participants during school holidays',
      'WAEC school tours leading to mentorship groups and physical training sessions',
    ],
    pathways: [
      {
        number: '1',
        name:        'Rural to Global Spotlight',
        description: 'Amplifies the stories of individuals who originated from rural or marginalised communities, faced limited access to resources, yet rose against all odds to thrive and serve meaningfully in society.',
        target:      'Young adults and professionals who have risen from rural or underserved communities',
      },
      {
        number: '2',
        name:        'Rural to Global Fellowship',
        description: 'Targets young people transitioning into or already in university, providing a structured three-month mentorship that includes skills training, leadership development, exposure to opportunities, and scholarships.',
        target:      'University students and young people transitioning into higher education',
      },
      {
        number: '3',
        name:        'Rural to Global Bootcamp',
        description: 'Focuses on younger participants identified through WAEC school tours, engaging them during school holidays through physical sessions and WhatsApp learning groups for an intensive one-week training that builds foundational skills and global competitiveness.',
        target:      'Secondary school graduates and younger people, especially WAEC candidates',
      },
    ],
    gallery: [
      { src: '/images/programs/rural-to-global/gallery-1.jpg', alt: 'Group at school tour' },
      { src: '/images/programs/rural-to-global/gallery-2.jpg', alt: 'Girls with placards' },
      { src: '/images/programs/rural-to-global/gallery-3.jpg', alt: '"Your Dream Deserves" sign' },
      { src: '/images/programs/rural-to-global/gallery-4.jpg', alt: 'Mentor with students' },
      { src: '/images/programs/rural-to-global/gallery-5.jpg', alt: 'Outdoor mentorship session' },
      { src: '/images/programs/rural-to-global/gallery-6.jpg', alt: '"The Future is Made by Girls" sign' },
    ],
  },
}

/* ─────────────────────────────────────────────
   Pathway Card — Rural to Global only
───────────────────────────────────────────── */
function PathwayCard({ number, name, description, target }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-3"
      style={{ border: '1px solid var(--color-border)', background: 'white' }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '8px',
          background: '#FFF7F0',
          fontSize: '1.125rem',
          fontWeight: 700,
          color: '#507A7C',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{name}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.65, flex: 1 }}>
        {description}
      </p>
      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#507A7C', marginBottom: '0.25rem' }}>
          Target Group:
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#374151' }}>{target}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function ProgramDetailPage() {
  const { slug } = useParams()
  const programme  = PROGRAMS[slug]

  if (!programme) {
    return (
      <div className="container-rugan section-padding text-center">
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
          Programme not found.
        </h1>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <PageHeroBanner
        title={programme.title}
        subtitle={programme.subtitle}
        backgroundImage={programme.heroImage}
        backLink={{ to: '/programmes', label: 'Back to Programmes' }}
        darkOverlay
        primaryFallback
      />

      {/* Programme Overview */}
      <section className="section-padding" style={{ background: '#EBEBEB' }}>
        <div className="container-rugan" style={{ maxWidth: '780px' }}>
          <motion.h2
            variants={fadeUp}
            initial='hidden'
            whileInView='visible'
            viewport={viewportOnce}
            style={{
              fontSize: 'clamp(1.375rem, 2.5vw, 1.75rem)',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            Programme Overview
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial='hidden'
            whileInView='visible'
            viewport={viewportOnce}
            style={{
              fontSize: '0.9375rem',
              color: '#374151',
              lineHeight: 1.75,
              textAlign: 'left',
            }}
          >
            {programme.overview}
          </motion.p>
        </div>
      </section>

      {/* Key Activities */}
      <section className="section-padding" style={{ background: '#FAFAFA' }}>
        <div className="container-rugan">
          <SectionHeader title="Key Activities" />
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 636px))',
              gap: '0.875rem',
              justifyContent: 'center',
              alignItems: 'stretch',
            }}
            variants={staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={viewportOnce}
          >
            {programme.activities.map((activity, i) => (
              <motion.div key={i} variants={fadeUp}><ChecklistItem text={activity} variant='card' /></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Three Interconnected Pathways — Rural to Global only */}
      {programme.pathways && (
        <section className="section-padding" style={{ background: '#FFF7F0' }}>
          <div className="container-rugan">
            <SectionHeader
              title="Three Interconnected Pathways"
              subtitle="The Rural to Global Programme operates through three complementary pathways, each targeting different stages of the journey from rural communities to global opportunities."
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
              }}
            >
              {programme.pathways.map((pathway, i) => (
                <PathwayCard key={i} {...pathway} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Programme Gallery */}
      <section className="section-padding" style={{ background: '#E1EDDE' }}>
        <div className="container-rugan">
          <SectionHeader title="Programme Gallery" />
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4" variants={staggerContainer} initial='hidden' whileInView='visible' viewport={viewportOnce}>
            {programme.gallery.map((img, i) => (
              <motion.div key={i} variants={scaleIn} className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Support CTA */}
      <CTABanner
        title="Support This Programme"
        subtitle="Your contribution can help us expand this programme and reach more girls."
        buttons={[
          { label: 'Volunteer With Us', to: '/volunteers', variant: 'volunteer' },
          { label: 'Make a Donation',   to: '/donate',     variant: 'primary'   },
        ]}
      />
    </>
  )
}
