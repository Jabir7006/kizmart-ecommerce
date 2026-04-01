import { Mail } from "lucide-react";

const NewsletterBanner = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <Mail className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
              Stay in the Loop
            </h2>
            <p className="mt-1.5 text-sm text-primary-foreground/75 max-w-md mx-auto">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals delivered to your inbox.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
