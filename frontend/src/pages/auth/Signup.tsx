import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { signupSchema } from "@/schemas/authSchema";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import AuthLayout from "@/components/layouts/AuthLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useAuth from "@/hooks/useAuth";

const Signup = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const { signupMutation } = useAuth();

  const onSubmit = (data: z.infer<typeof signupSchema>) => {
    signupMutation.mutate(data);
  };

  const footerContent = (
    <>
      <Button
        type="submit"
        form="signup-form"
        className="w-full text-md h-11 cursor-pointer"
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? (
          <LoadingSpinner size={18} />
        ) : (
          <UserPlus className="size-4" />
        )}
        {signupMutation.isPending ? "Creating account..." : "Create account"}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to join Kizmart"
      footer={footerContent}
    >
      <form
        id="signup-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FieldGroup>
          <FormInput
            name="fullName"
            control={form.control}
            label="Full Name"
            placeholder="John Doe"
            autoComplete="name"
          />
          <FormInput
            name="email"
            control={form.control}
            label="Email Address"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
          />
          <FormInput
            name="password"
            control={form.control}
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </FieldGroup>
      </form>
    </AuthLayout>
  );
};

export default Signup;
