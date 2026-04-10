import { ShieldCheck, Truck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CartItem from "@/components/cart/CartItem";

import type { CartItem as CartItemType } from "@/types/cartType";

interface OrderSummaryProps {
  items: CartItemType[];
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  buttonText: string;
  onButtonClick: () => void;
}

export const OrderSummary = ({
  items,
  subtotal,
  shippingFee,
  totalPrice,
  buttonText,
  onButtonClick,
}: OrderSummaryProps) => {
  return (
    <div className="sticky top-24 space-y-6">
      <section
        className="animate-in slide-in-from-right-8 duration-500 fade-in fill-mode-both"
        style={{ animationDelay: "400ms" }}
      >
        <Card className="rounded-2xl shadow-sm border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="h-2 bg-linear-to-r from-primary to-primary/40 w-full" />
          <CardHeader className="pb-4 border-b border-neutral-100 dark:border-neutral-800/60">
            <CardTitle className="text-xl">Order Summary</CardTitle>
            <CardDescription>
              Review your items before finalizing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="max-h-75 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
              {items.length > 0 ? (
                items.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))
              ) : (
                <p className="text-sm text-neutral-500 text-center py-4">
                  Your cart is empty.
                </p>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  ৳{Math.round(subtotal).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-sm">Shipping</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {shippingFee > 0
                    ? `৳${Math.round(shippingFee).toLocaleString()}`
                    : "Calculated at next step"}
                </span>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-end">
                <span className="text-base font-medium">Total</span>
                <span className="text-2xl font-bold">
                  ৳{Math.round(totalPrice).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 bg-neutral-50/50 dark:bg-neutral-900/20 pt-6">
            <Button
              size="lg"
              onClick={onButtonClick}
              className="w-full text-base font-medium h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
            >
              {buttonText}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 w-full animate-in fade-in duration-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Guaranteed safe & secure checkout
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Guarantees / Trust Badges */}
      <section
        className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
        style={{ animationDelay: "500ms" }}
      >
        <div className="flex items-start gap-3 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Fast Delivery</h4>
            <p className="text-xs text-neutral-500 mt-0.5">2-4 business days</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Free Returns</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Within 30 days</p>
          </div>
        </div>
      </section>
    </div>
  );
};
