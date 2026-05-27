import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Expertise from "@/components/Expertise";
import Services from "@/components/Services";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProjects from "@/components/FeaturedProjects";
import TechnologyPartners from "@/components/TechnologyPartners";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getPublishedSite } from "@/lib/cms-data";

export default async function Home() {
  const site = await getPublishedSite();

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />
      <Hero slides={site.heroSlides} />
      <Expertise />
      <Services />
      <FeaturedProducts products={site.featuredProducts} />
      <FeaturedProjects projects={site.featuredProjects} />
      <TechnologyPartners partners={site.partners} />
      <Contact contact={site.contact} />
      <Footer />
    </div>
  );
}
