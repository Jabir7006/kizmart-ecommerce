import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ShippingAddress = () => {
  return (
    <section className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both" style={{ animationDelay: '200ms' }}>
      <div className="flex flex-col gap-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-medium">Shipping Address</h2>
            <p className="text-sm text-neutral-500">Where should we send your order?</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="country">Country/Region</Label>
            <Input id="country" defaultValue="United States" className="h-11 bg-neutral-50 dark:bg-neutral-800/50" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="John" className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Doe" className="h-11" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="123 Shopping Avenue, Floor 4" className="h-11" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="grid gap-2 lg:col-span-1">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="New York" className="h-11" />
            </div>
            <div className="grid gap-2 lg:col-span-1">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="NY" className="h-11" />
            </div>
            <div className="grid gap-2 col-span-2 lg:col-span-1">
              <Label htmlFor="zip">ZIP code</Label>
              <Input id="zip" placeholder="10001" className="h-11" />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="h-11" />
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <input type="checkbox" id="save-info" className="rounded border-neutral-300 text-primary w-4 h-4 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-800" />
            <Label htmlFor="save-info" className="text-sm font-normal text-neutral-500 hover:cursor-pointer">
              Save this information for next time
            </Label>
          </div>
        </div>
      </div>
    </section>
  );
};
