"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FlipText } from "../Landing/FlipLink";
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconLoader2,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: signInData, error: signInError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        // Handle specific error cases
        if (
          signInError.message?.includes("Invalid email or password") ||
          signInError.message?.includes("Incorrect") ||
          signInError.status === 401
        ) {
          setFormError("email", {
            type: "manual",
            message: "Invalid email or password",
          });
          setFormError("password", {
            type: "manual",
            message: "Invalid email or password",
          });
          return;
        }

        if (signInError.message?.includes("not found")) {
          setFormError("email", {
            type: "manual",
            message: "No account found with this email",
          });
          return;
        }

        throw new Error(signInError.message || "Failed to sign in");
      }

      // Successfully logged in - redirect to dashboard
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsSocialLoading(provider);
    setError(null);

    try {
      const { data: socialData, error: socialError } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (socialError) {
        throw new Error(
          socialError.message || `Failed to sign in with ${provider}`
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initiate social login. Please try again."
      );
      setIsSocialLoading(null);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 font-hanken-grotesk", className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Github or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive mb-4">
                  {error}
                </div>
              )}

              <Field>
                <FlipText>
                  <Button
                    className="w-full"
                    variant="outline"
                    type="button"
                    onClick={() => handleSocialLogin("github")}
                    disabled={isLoading || isSocialLoading !== null}
                  >
                    {isSocialLoading === "github" ? (
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <IconBrandGithubFilled />
                    )}
                    Login with Github
                  </Button>
                </FlipText>
                <FlipText>
                  <Button
                    className="w-full"
                    variant="outline"
                    type="button"
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading || isSocialLoading !== null}
                  >
                    {isSocialLoading === "google" ? (
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <IconBrandGoogleFilled />
                    )}
                    Login with Google
                  </Button>
                </FlipText>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  disabled={isLoading}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isLoading}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <FlipText>
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoading || isSocialLoading !== null}
                  >
                    {isLoading ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </FlipText>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/get-started"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}