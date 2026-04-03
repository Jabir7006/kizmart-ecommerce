type ProductPricingInput = {
  price: number;
  salePrice?: number | null;
};

export const getProductPricing = ({
  price,
  salePrice,
}: ProductPricingInput) => {
  const originalPrice = Number(price);
  const discountedPrice =
    typeof salePrice === "number" ? Number(salePrice) : originalPrice;
  const hasDiscount = discountedPrice < originalPrice;

  const discountPercentage =
    hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : null;

  return {
    hasDiscount,
    badge: hasDiscount ? "Sale" : "New",
    displayPrice: hasDiscount ? discountedPrice : originalPrice,
    originalPrice: hasDiscount ? originalPrice : null,
    discountPercentage,
  };
};
