import { useParams } from "react-router-dom";
import { useSimilarProducts, useSingleProduct } from "@/hooks/useProduct";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductList from "@/components/product/ProductList";

const ProductDetails = () => {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useSingleProduct(slug!);
  const similarProductsQuery = useSimilarProducts(slug!, 8);
  const similarProducts = similarProductsQuery.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size={40} className="text-orange-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
        <p className="text-gray-600">
          {error?.message || "Product not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Main Product Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Gallery */}
          <div className="w-full lg:sticky lg:top-24">
            <ProductGallery
              thumbnail={product.thumbnail}
              gallery={product.gallery}
              title={product.title}
            />
          </div>

          {/* Right Column: Info */}
          <div className="w-full">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="mt-16 lg:mt-24 pt-12 border-t border-gray-100">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Product Overview
            </h3>
            <div className="prose prose-orange max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
              {product.longDescription}
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-24 pt-12 border-t border-gray-100">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                You May Also Like
              </h3>
            </div>
          </div>

          <ProductList
            products={similarProducts}
            productsQuery={similarProductsQuery}
            className="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
