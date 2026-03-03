import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";

import { signinSchema } from "@/schemas/authSchema";
import { FormInput } from "@/components/ui/FormInput";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import AuthLayout from "@/components/layouts/AuthLayout";

const Signin = () => {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof signinSchema>) => {
    console.log(data);
    // TODO: Implement actual signin logic
  };

  const footerContent = (
    <>
      <Button type="submit" form="signin-form" className="w-full text-md h-11">
        Sign in
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-colors"
        >
          Sign up
        </Link>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your email and password to access your account"
      footer={footerContent}
    >
      <form
        id="signin-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FieldGroup>
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
            autoComplete="current-password"
          />
        </FieldGroup>
      </form>
    </AuthLayout>
  );
};

export default Signin;
