import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PaymentMethod = "card" | "paypal" | "cod";

interface PaymentOptionsProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}

export const PaymentOptions = ({
  paymentMethod,
  setPaymentMethod,
}: PaymentOptionsProps) => {
  return (
    <section
      className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both"
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex flex-col gap-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-medium">Payment Options</h2>
            <p className="text-sm text-neutral-500">
              Only Cash on Delivery is available right now. Other methods are
              coming soon.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {/* Payment Method Selector */}
          <div className="grid gap-3">
            <div
              className={`relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                paymentMethod === "card"
                  ? "border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              }`}
              aria-disabled="true"
              title="Card payments are coming soon"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-900">
                    <div className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  </div>
                  <div className="grid gap-1">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      Credit card
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        Coming soon
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[#1A1F71]">
                        Visa
                      </span>
                      <span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[#EB001B]">
                        Mastercard
                      </span>
                      <span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[#006FCF]">
                        Amex
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                paymentMethod === "paypal"
                  ? "border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              }`}
              aria-disabled="true"
              title="PayPal is coming soon"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-900">
                    <div className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  </div>
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    PayPal
                    <span className="bg-blue-100 text-[#003087] dark:bg-blue-900 dark:text-blue-100 text-xs px-2 py-0.5 rounded-full font-bold italic">
                      PayPal
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      Coming soon
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <div
              className={`relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                paymentMethod === "cod"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 hover:dark:border-neutral-700 bg-white dark:bg-neutral-900"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${paymentMethod === "cod" ? "border-primary" : "border-neutral-300 dark:border-neutral-600"}`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm">
                    Cash on Delivery (COD)
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Payment Form */}
          <div
            className={`grid gap-4 overflow-hidden transition-all duration-300 ease-in-out ${paymentMethod === "card" ? "max-h-125 mt-2 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    className="h-11 pl-10 bg-white dark:bg-neutral-950"
                  />
                  <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiration date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM / YY"
                    className="h-11 bg-white dark:bg-neutral-950"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">Security code</Label>
                  <Input
                    id="cvc"
                    placeholder="CVC"
                    className="h-11 bg-white dark:bg-neutral-950"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nameOnCard">Name on card</Label>
                <Input
                  id="nameOnCard"
                  placeholder="Name as it appears on card"
                  className="h-11 bg-white dark:bg-neutral-950"
                />
              </div>
            </div>
          </div>

          {paymentMethod === "paypal" && (
            <div className="animate-in fade-in duration-300 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-6 text-center text-sm text-neutral-500">
              <p>
                After clicking "Pay now", you will be redirected to PayPal to
                complete your purchase securely.
              </p>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="animate-in fade-in duration-300 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-6 text-center text-sm text-neutral-500">
              <p>
                You can pay in cash or via card reader right when your order is
                delivered to your door.
              </p>
              <p className="mt-2 text-primary font-medium">
                A small handling fee may apply.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
