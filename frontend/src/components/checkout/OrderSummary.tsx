import { ShieldCheck, Truck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { MOCK_CART } from "@/lib/constants";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  buttonText: string;
  onButtonClick: () => void;
}

export const OrderSummary = ({
  subtotal,
  shipping,
  taxes,
  total,
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
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
              {MOCK_CART.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-medium line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      {item.color}
                    </p>
                  </div>
                  <div className="text-sm font-medium pt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              {/* Discount Code */}
              <div className="flex gap-2">
                <Input placeholder="Discount code" className="h-10 text-sm" />
                <Button variant="secondary" className="h-10 px-4 shrink-0">
                  Apply
                </Button>
              </div>

              <Separator className="my-2 opacity-50" />

              {/* Calculations */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Estimated taxes</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    ${taxes.toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-xs text-neutral-500">
                    Including $1.50 in taxes
                  </span>
                </div>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
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
