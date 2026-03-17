import { useState, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { ShippingAddress } from "@/components/checkout/ShippingAddress";
import { PaymentOptions } from "@/components/checkout/PaymentOptions";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { useCartQuery } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/checkout/Stepper";
import { useCreateOrder } from "@/hooks/useOrder";
import { useClearCart } from "@/hooks/useCart";
import { useOrderStore } from "@/store/useOrderStore";
import type { Address } from "@/types/addressType";

type PaymentMethod = "card" | "paypal" | "cod";
type Step = 1 | 2 | 3;

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedAddressSnapshot, setSelectedAddressSnapshot] =
    useState<Address | null>(null);

  const { data: cart } = useCartQuery();
  const subtotal = cart?.totalPrice ?? 0;

  const shippingFee = selectedAddressSnapshot
    ? selectedAddressSnapshot.city?.toLowerCase() === "dhaka"
      ? 60
      : 120
    : 0;

  const totalPrice = subtotal + shippingFee;

  const { mutate: createOrder, isPending: isPlacingOrder } = useCreateOrder();
  const { mutate: clearCart } = useClearCart();
  const {
    setOrderSummary,
    orderTotal,
    shippingFee: storedShippingFee,
  } = useOrderStore();

  // Stable callback — won't cause unnecessary re-renders of ShippingAddress
  const handleAddressSelect = useCallback((id: string, address?: Address) => {
    setSelectedAddressId(id);
    if (address) {
      setSelectedAddressSnapshot(address);
    } else {
      setSelectedAddressSnapshot(null);
    }
  }, []);

  // check if cart is empty (after all hooks) – but allow showing confirmation
  if (currentStep !== 3 && cart?.items.length === 0) {
    toast.error("Your cart is empty. Please add items to your cart.");
    return <Navigate to="/" replace />;
  }

  const handleNext = () => {
    // Validate step 1: must have a selected address
    if (currentStep === 1 && !selectedAddressId) {
      toast.error("Please select a shipping address before continuing.");
      return;
    }

    if (currentStep < 3) setCurrentStep((currentStep + 1) as Step);
    if (currentStep === 2) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const handlePlaceOrder = () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!selectedAddressId || !selectedAddressSnapshot) {
      toast.error(
        "Please select a shipping address before placing your order.",
      );
      return;
    }

    if (paymentMethod !== "cod") {
      toast.error("Only Cash on Delivery is available at the moment.");
      return;
    }

    const backendPaymentMethodMap: Record<PaymentMethod, string> = {
      cod: "cash_on_delivery",
      card: "card",
      paypal: "paypal",
    };

    const payload = {
      shippingAddress: {
        fullName: selectedAddressSnapshot.fullName,
        phoneNumber: selectedAddressSnapshot.phoneNumber,
        streetAddress: selectedAddressSnapshot.streetAddress,
        city: selectedAddressSnapshot.city,
        state: selectedAddressSnapshot.state,
        postalCode: selectedAddressSnapshot.postalCode,
      },
      paymentMethod: backendPaymentMethodMap[
        paymentMethod
      ] as "cash_on_delivery",
    };

    createOrder(payload, {
      onSuccess: () => {
        // Store the order summary before clearing the cart
        setOrderSummary(totalPrice, shippingFee);
        clearCart();
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link
            to="/cart"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Checkout
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Complete your order by providing your payment details.
          </p>
        </div>

        {/* Stepper UI */}
        <Stepper currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Area */}
          <div
            className={`${currentStep === 3 ? "lg:col-span-12" : "lg:col-span-7"} space-y-8 transition-all duration-500`}
          >
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <ShippingAddress onAddressSelect={handleAddressSelect} />
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleNext}
                    className="w-full sm:w-auto h-11 px-8 rounded-full font-medium"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <PaymentOptions
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
                <div className="flex justify-between mt-6">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="h-11 px-8 rounded-full font-medium"
                  >
                    Back to Address
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="h-11 px-8 rounded-full font-medium"
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder
                      ? "Placing Order..."
                      : "Complete Order (COD)"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <OrderConfirmation
                  total={orderTotal ?? totalPrice}
                  shippingFee={storedShippingFee ?? shippingFee}
                  paymentMethod={paymentMethod}
                />
              </div>
            )}
          </div>

          {/* Order Summary Sticky Sidebar - Hide on Step 3 */}
          {currentStep !== 3 && (
            <div className="lg:col-span-5 relative z-10 transition-all duration-500">
              <OrderSummary
                items={cart?.items ?? []}
                subtotal={subtotal}
                shippingFee={shippingFee}
                totalPrice={totalPrice}
                buttonText={
                  currentStep === 1 ? "Continue to Payment" : "Place Order"
                }
                onButtonClick={
                  currentStep === 1 ? handleNext : handlePlaceOrder
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
