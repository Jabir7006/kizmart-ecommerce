import HeroSlider from "@/components/home/carousel/HeroSlider";
import useProduct from "@/hooks/useProduct";
import ProductList from "@/components/product/ProductList";
import QuickViewDialog from "@/components/product/QuickViewDialog";

const Home = () => {
  const { products, productsQuery } = useProduct();
  return (
    <main>
      <HeroSlider />
      <div className="max-w-screen-xl mx-auto px-2 py-8">
        <h1 className="text-xl font-medium mb-4">New Arrivals</h1>

        <ProductList products={products} productsQuery={productsQuery} />
      </div>
      <QuickViewDialog />
    </main>
  );
};

export default Home;
