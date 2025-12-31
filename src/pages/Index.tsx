import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { organizationSchema, websiteSchema } from "@/utils/schemas";

const Index = () => {
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema],
  };

  return (
    <>
      <SEOHead
        title="Somthing | Art Posters That Speak to Your Walls"
        description="Discover unique wall art posters that transform your space. From abstract to botanical prints, find the perfect piece for every room. Premium quality, vibrant colors."
        keywords="wall posters, art prints, home decor, abstract art, botanical prints, wall art, poster shop, modern wall art, affordable art prints"
        canonical="/"
        schema={combinedSchema}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <FeaturedProducts />
          <Categories />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

