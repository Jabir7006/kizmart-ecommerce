import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

const AuthLayout = ({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm sm:max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-2 pb-6 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          {footer}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthLayout;
