import HeroSlider from "@/components/home/carousel/HeroSlider";
import { useNewArrivalsProducts } from "@/hooks/useProduct";
import ProductList from "@/components/product/ProductList";
import QuickViewDialog from "@/components/product/QuickViewDialog";

const Home = () => {
  const productsQuery = useNewArrivalsProducts();
  const products = productsQuery.data?.data || [];
  return (
    <main>
      <HeroSlider />
      <div className="max-w-7xl mx-auto px-2 py-8">
        <h1 className="text-xl font-medium mb-4">New Arrivals</h1>

        <ProductList
          products={products}
          productsQuery={productsQuery}
          className="grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      </div>
      <QuickViewDialog />
    </main>
  );
};

export default Home;
