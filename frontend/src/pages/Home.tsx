import HeroSlider from "@/components/home/carousel/HeroSlider";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import CategoryGrid from "@/components/home/CategoryGrid";
import SectionHeader from "@/components/home/SectionHeader";
import NewsletterBanner from "@/components/home/NewsletterBanner";
import { useNewArrivalsProducts } from "@/hooks/useProduct";
import ProductList from "@/components/product/ProductList";
import QuickViewDialog from "@/components/product/QuickViewDialog";

const Home = () => {
  const productsQuery = useNewArrivalsProducts();
  const products = productsQuery.data?.data || [];

  return (
    <>
      {/* Hero Banner Carousel */}
      <HeroSlider />

      {/* Trust / Service Highlights */}
      <ServiceFeatures />

      {/* Featured Categories */}
      <CategoryGrid />

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <SectionHeader
          title="New Arrivals"
          subtitle="Check out the latest additions to our store"
          linkText="View All"
          linkHref="/store?sortBy=createdAt&sortOrder=desc"
        />

        <ProductList
          products={products}
          productsQuery={productsQuery}
          className="grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      </section>

      {/* Newsletter CTA */}
      <NewsletterBanner />

      <QuickViewDialog />
    </>
  );
};

export default Home;
