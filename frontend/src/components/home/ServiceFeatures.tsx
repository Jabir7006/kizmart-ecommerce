import { Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ৳1,000",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service",
  },
] as const;

const ServiceFeatures = () => {
  return (
    <section className="border-y border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-center gap-3 sm:gap-4"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
                  {title}
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug mt-0.5">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;
