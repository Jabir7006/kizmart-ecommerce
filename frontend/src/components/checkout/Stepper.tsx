import { Check, CreditCard, MapPin, ShoppingBag } from 'lucide-react';


const Stepper = ({ currentStep }: { currentStep: number }) => {
  const STEPS = [
    { id: 1, name: "Shipping Address", icon: MapPin },
    { id: 2, name: "Payment & Review", icon: CreditCard },
    { id: 3, name: "Confirmation", icon: ShoppingBag },
  ];

  return (
    <nav
          aria-label="Checkout progress"
          className="mb-10 animate-in fade-in duration-500"
        >
          <ol className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <li
                  key={step.id}
                  className="flex flex-col items-center flex-1 relative"
                  aria-current={isActive ? "step" : undefined}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-white"
                        : isActive
                          ? "border-primary text-primary bg-white dark:bg-neutral-950 shadow-md transform scale-110"
                          : "border-neutral-200 text-neutral-400 bg-white dark:bg-neutral-900 dark:border-neutral-800"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-3 font-medium transition-colors duration-300 md:text-sm text-center ${isActive || isCompleted ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400"}`}
                  >
                    {step.name}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`absolute top-6 left-[60%] w-[80%] h-0.5 transition-colors duration-500 z-0 ${isCompleted ? "bg-primary" : "bg-neutral-200 dark:bg-neutral-800"}`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
  )
}

export default Stepper