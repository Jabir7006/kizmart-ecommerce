import HeroSlider from "@/components/home/carousel/HeroSlider";
import useProduct from "@/hooks/useProduct";
import ProductList from "@/product/ProductList";

const Home = () => {
  const { products, productsQuery } = useProduct();
  return (
    <main>
      <HeroSlider />
      <div className="max-w-screen-xl mx-auto px-2 py-4">
        <h1 className="text-xl font-medium mb-4">Just For You</h1>

        <ProductList products={products} productsQuery={productsQuery} />
      </div>
    </main>
  );
};

export default Home;
