import SectionHeader from "@/components/home/SectionHeader";
import ProductList from "@/components/product/ProductList";
import { useNewArrivalsProducts } from "@/hooks/useProduct";

const NewArrivalsSection = () => {
  const productsQuery = useNewArrivalsProducts();
  const products = productsQuery.data?.data || [];

  return (
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
  );
};

export default NewArrivalsSection;
