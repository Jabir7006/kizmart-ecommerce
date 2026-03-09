import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ContactInfo = () => {
  return (
    <section className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both" style={{ animationDelay: '100ms' }}>
      <div className="flex flex-col gap-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-medium">Contact Information</h2>
            <p className="text-sm text-neutral-500">We'll use this to send order updates.</p>
          </div>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="john@example.com" defaultValue="user@kizmart.com" className="h-11" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="offers" className="rounded border-neutral-300 text-primary w-4 h-4 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-800" defaultChecked />
            <Label htmlFor="offers" className="text-sm font-normal text-neutral-500 hover:cursor-pointer">
              Email me with news and offers
            </Label>
          </div>
        </div>
      </div>
    </section>
  );
};
