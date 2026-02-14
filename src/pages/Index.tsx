import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Health360Section } from "@/components/home/Health360Section";
import { NewsSection } from "@/components/home/NewsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <Health360Section />
      <NewsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
