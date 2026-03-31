import { useStoreFilters } from "@/hooks/useStoreFilters";
import { useCategory } from "@/hooks/useCategory";
import { useBrand } from "@/hooks/useBrand";
import ProductList from "@/components/product/ProductList";
import QuickViewDialog from "@/components/product/QuickViewDialog";
import StoreFilter from "@/components/store/StoreFilter";

const StorePage = () => {
  const { products, productsQuery, filters, setFilters, resetFilters } =
    useStoreFilters();
  const { categories } = useCategory();
  const { brands } = useBrand();

  const q = filters.search;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 relative flex flex-col md:flex-row gap-8 min-h-[calc(100vh-200px)]">
      {/* Sidebar Filters */}
      <StoreFilter
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        brands={brands}
        totalProducts={productsQuery.data?.metadata?.total || 0}
        onClear={resetFilters}
      />

      {/* Main Content */}
      <section className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            {q ? `Search Results for "${q}"` : "All Products"}
          </h1>
          {q && (
            <p className="text-muted-foreground mt-1">
              Showing matching items from our store catalog.
            </p>
          )}
        </div>

        <ProductList products={products} productsQuery={productsQuery} />
      </section>

      <QuickViewDialog />
    </main>
  );
};

export default StorePage;
