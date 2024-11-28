"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An error occurred during authentication";
  if (error === "OAuthAccountNotLinked") {
    errorMessage =
      "To confirm your identity, sign in with the same account you used originally.";
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-red-600">
            Authentication Error
          </h1>
          <p className="text-gray-500">{errorMessage}</p>
        </div>
        <Button
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Try Again with Google
        </Button>
      </div>
    </div>
  );
}
