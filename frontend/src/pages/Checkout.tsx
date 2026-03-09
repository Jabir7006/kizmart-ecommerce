import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { ContactInfo } from "@/components/checkout/ContactInfo";
import { ShippingAddress } from "@/components/checkout/ShippingAddress";
import { PaymentOptions } from "@/components/checkout/PaymentOptions";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { MOCK_CART } from "@/lib/constants";

type PaymentMethod = "card" | "paypal" | "cod";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  
  const subtotal = MOCK_CART.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const shipping = 15.0;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/cart" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">Checkout</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Complete your order by providing your payment details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Form Content */}
          <div className="lg:col-span-7 space-y-8">
            <ContactInfo />
            <ShippingAddress />
            <PaymentOptions 
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod} 
            />
          </div>

          {/* Order Summary Sticky Sidebar */}
          <div className="lg:col-span-5">
            <OrderSummary 
              paymentMethod={paymentMethod}
              subtotal={subtotal}
              shipping={shipping}
              taxes={taxes}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
