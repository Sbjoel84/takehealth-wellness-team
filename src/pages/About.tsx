import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CheckCircle2, Target, Eye, Heart, Users, Award, Lightbulb, Briefcase, Newspaper, Building2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import aboutTeam from "@/assets/about-team.jpg";
import partnersImg from "@/assets/Partners.jpg";
import careerCulture from "@/assets/Careers-Culture.jpg";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We care deeply about every individual's wellness journey.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace technology and modern approaches to healthcare.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in the power of connection and support.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for the highest standards in everything we do.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section with Partners Image as Background */}
      <section 
        className="relative text-primary-foreground py-24 lg:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${partnersImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-primary-foreground/20 px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              About Us
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Your Partner in Total Wellness
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-primary-foreground/90"
            >
              Founded on the belief that health is more than the absence of illness, takehealth
              Global Ltd was created to fill the gap between traditional healthcare and
              sustainable wellness.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-wellness p-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To help individuals live healthier lives by delivering fitness, lifestyle
                medicine, and wellness care through connected physical services and secure
                digital platforms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-wellness p-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-wellness-coral-light flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-secondary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A healthier World where anyone can easily access trusted wellness support and
                healthcare, anytime, anywhere, through one integrated ecosystem.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeader
                label="Our Story"
                title="Redefining Wellness Through Integration"
                align="left"
              />
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Welcome to takehealth Global Ltd, where we redefine wellness through an
                  integrated, 360-degree approach to health. Our mission is simple: to empower
                  individuals to reach their optimal physical, mental, and emotional state
                  through a blend of evidence-based therapies, expert coaching, and holistic
                  lifestyle services.
                </p>
                <p>
                  At takehealth, we don't believe in quick fixes. Instead, we combine science,
                  compassion, and innovation to create programs that are personalised,
                  preventative, and purpose-driven.
                </p>
                <p>
                  Our multidisciplinary team includes licensed therapists, physiotherapists,
                  fitness coaches, skin and dental specialists, all united by a shared goal: to
                  help you move better, feel better, and live fully.
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "Evidence-based therapies and expert coaching",
                  "Personalised, preventative programs",
                  "Multidisciplinary team of specialists",
                  "AI-powered personalisation technology",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-wellness-lg">
                <img
                  src={aboutTeam}
                  alt="Our wellness team"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            label="Our Values"
            title="What Drives Us"
            description="The core principles that guide everything we do at takehealth."
          />

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-wellness p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            label="Our Partners"
            title="Trusted Healthcare Partners"
            description="We collaborate with leading organisations to deliver exceptional wellness services."
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-wellness-lg bg-muted/30">
              <img
                src={partnersImg}
                alt="Our healthcare partners"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "Federal Ministry of Health", logo: "🇳🇬" },
              { name: "Nigerian Health Association", logo: "🏥" },
              { name: "SON Nigeria", logo: "✓" },
              { name: "Leading Hospitals", logo: "🏨" },
            ].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3 text-2xl">
                  {partner.logo}
                </div>
                <p className="text-sm font-medium text-center text-muted-foreground">
                  {partner.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers & Culture */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-wellness-lg">
                <img
                  src={careerCulture}
                  alt="Career and culture at takehealth"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeader
                label="Careers & Culture"
                title="Join Our Team"
                align="left"
              />
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  At takehealth, we believe that our people are our greatest asset. We're always
                  looking for passionate, talented individuals who share our commitment to
                  transforming lives through holistic wellness.
                </p>
                <p>
                  Our culture is built on collaboration, continuous learning, and a genuine
                  care for both our team members and our clients. We offer a supportive
                  environment where innovation thrives and every voice is heard.
                </p>
                <p>
                  Whether you're a healthcare professional, wellness coach, or tech enthusiast,
                  there might be a place for you in our growing family.
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "Competitive benefits and professional development",
                  "Collaborative and inclusive work environment",
                  "Opportunities to make a real impact on people's lives",
                  "Flexible working arrangements",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsroom & Media */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            label="Newsroom & Media"
            title="Latest Updates & Milestones"
            description="Stay informed about our latest news, press releases, awards, and media coverage."
          />

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                type: "Press Release",
                title: "takehealth Announces Strategic Partnership with Leading Healthcare Network",
                date: "January 15, 2026",
                excerpt: "We're excited to announce a new partnership that expands our reach and enhances our service offerings.",
              },
              {
                type: "Award",
                title: "Recognised as Best Integrated Wellness Provider 2025",
                date: "December 10, 2025",
                excerpt: "takehealth Global Ltd receives prestigious industry award for excellence in holistic wellness services.",
              },
              {
                type: "Media Coverage",
                title: "Featured in Health & Wellness Magazine",
                date: "November 22, 2025",
                excerpt: "Our CEO shares insights on the future of integrated wellness in an exclusive interview.",
              },
            ].map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-wellness p-6 hover:shadow-wellness-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {news.type}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">{news.date}</p>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                  {news.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {news.excerpt}
                </p>
                <button className="mt-4 text-primary font-medium text-sm hover:underline">
                  Read More →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
