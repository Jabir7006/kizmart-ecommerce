import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AuthProvider from "@/components/providers/AuthProvider";

// Import the combined router we just created
import { router } from "@/routes";

const App = () => {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-svh">
            <LoadingSpinner size={32} className="text-primary" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
};

export default App;
