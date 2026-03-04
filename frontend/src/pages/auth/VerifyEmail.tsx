import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { MailOpen, ArrowLeft, RefreshCw } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const { verifyEmailMutation, resendVerificationMutation } = useAuth();
  const user = useAuthStore((state) => state.user);

  const handleSubmit = () => {
    if (code.length === 6) {
      verifyEmailMutation.mutate(code);
    }
  };

  const handleResend = () => {
    resendVerificationMutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-svh p-6 md:p-10">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MailOpen className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-base">
            We sent a 6-digit verification code to{" "}
            <span className="font-medium text-foreground">
              {user?.email ?? "your email"}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={code}
            onChange={setCode}
            onComplete={handleSubmit}
            disabled={verifyEmailMutation.isPending}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleSubmit}
            className="w-full text-md h-11 cursor-pointer"
            disabled={code.length !== 6 || verifyEmailMutation.isPending}
          >
            {verifyEmailMutation.isPending ? (
              <>
                <LoadingSpinner size={18} />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-3 pt-2">
          <div className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resendVerificationMutation.isPending}
              className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {resendVerificationMutation.isPending ? (
                <>
                  <RefreshCw className="size-3 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend code"
              )}
            </button>
          </div>

          <Link
            to="/signin"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
