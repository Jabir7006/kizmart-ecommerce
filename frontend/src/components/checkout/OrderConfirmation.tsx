import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderConfirmationProps {
  total: number;
  paymentMethod: string;
}

export const OrderConfirmation = ({
  total,
  paymentMethod,
}: OrderConfirmationProps) => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col items-center max-w-2xl mx-auto">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 delay-200">
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Order Confirmed!</h2>
      <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mb-8 max-w-md">
        Thank you for your purchase. We have received your order and will send
        you a confirmation email shortly.
      </p>

      <div className="bg-neutral-50 dark:bg-neutral-950 rounded-2xl w-full p-5 sm:p-6 text-left mb-8 border border-neutral-100 dark:border-neutral-800 text-sm sm:text-base">
        <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-3 sm:pb-4 sm:mb-4">
          <span className="text-neutral-500">Order Number</span>
          <span className="font-medium">#ORD-X8K9V2</span>
        </div>
        <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-3 sm:pb-4 sm:mb-4">
          <span className="text-neutral-500">Total Amount</span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Payment Method</span>
          <span className="font-medium capitalize">
            {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">
        <Link to="/" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full h-11 px-6 sm:px-8 rounded-full"
          >
            Return Home
          </Button>
        </Link>
        <Button className="w-full h-11 px-6 sm:px-8 rounded-full">
          View Order Details
        </Button>
      </div>
    </div>
  );
};
