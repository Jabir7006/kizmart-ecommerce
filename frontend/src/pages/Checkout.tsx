import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Check,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

import { ShippingAddress } from "@/components/checkout/ShippingAddress";
import { PaymentOptions } from "@/components/checkout/PaymentOptions";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { MOCK_CART } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type PaymentMethod = "card" | "paypal" | "cod";
type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1, name: "Shipping Address", icon: MapPin },
  { id: 2, name: "Payment & Review", icon: CreditCard },
  { id: 3, name: "Confirmation", icon: ShoppingBag },
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const subtotal = MOCK_CART.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 15.0;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((currentStep + 1) as Step);
    if (currentStep === 2) {
      // Scroll to top on finish
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
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
        <div className="mb-10 animate-in fade-in duration-500">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1 relative"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 
                    ${
                      currentStep > step.id
                        ? "bg-primary border-primary text-white"
                        : currentStep === step.id
                          ? "border-primary text-primary bg-white dark:bg-neutral-950 shadow-md transform scale-110"
                          : "border-neutral-200 text-neutral-400 bg-white dark:bg-neutral-900 dark:border-neutral-800"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-3 font-medium transition-colors duration-300 md:text-sm text-center ${currentStep >= step.id ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400"}`}
                  >
                    {step.name}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`absolute top-6 left-[60%] w-[80%] h-[2px] transition-colors duration-500 z-0 ${currentStep > step.id ? "bg-primary" : "bg-neutral-200 dark:bg-neutral-800"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Area */}
          <div
            className={`${currentStep === 3 ? "lg:col-span-12" : "lg:col-span-7"} space-y-8 relative overflow-hidden min-h-[600px] transition-all duration-500`}
          >
            {/* Step 1: Address */}
            <div
              className={`absolute top-0 w-full transition-all duration-500 ease-in-out ${currentStep === 1 ? "opacity-100 translate-x-0 relative" : "-translate-x-full opacity-0 absolute pointer-events-none"}`}
            >
              <ShippingAddress />
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleNext}
                  className="w-full sm:w-auto h-11 px-8 rounded-full font-medium"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div
              className={`absolute top-0 w-full transition-all duration-500 ease-in-out ${currentStep === 2 ? "opacity-100 translate-x-0 relative" : currentStep > 2 ? "-translate-x-full opacity-0 absolute pointer-events-none" : "translate-x-full opacity-0 absolute pointer-events-none"}`}
            >
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
                  onClick={handleNext}
                  className="h-11 px-8 rounded-full font-medium"
                >
                  Complete Order
                </Button>
              </div>
            </div>

            {/* Step 3: Confirmation */}
            <div
              className={`absolute top-0 w-full transition-all duration-500 ease-in-out ${currentStep === 3 ? "opacity-100 translate-x-0 relative" : "translate-x-full opacity-0 absolute pointer-events-none"}`}
            >
              <OrderConfirmation total={total} paymentMethod={paymentMethod} />
            </div>
          </div>

          {/* Order Summary Sticky Sidebar - Hide on Step 3 */}
          {currentStep !== 3 && (
            <div className="lg:col-span-5 relative z-10 transition-all duration-500">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                taxes={taxes}
                total={total}
                buttonText={currentStep === 1 ? "Continue to Payment" : (paymentMethod === "paypal" ? "Proceed with PayPal" : "Pay now")}
                onButtonClick={handleNext}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
