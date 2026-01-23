"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    IconBrandGithubFilled,
    IconBrandGoogleFilled,
    IconLoader2,
} from "@tabler/icons-react";
import { FlipText } from "../Landing/FlipLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Validation Schema
const signupSchema = z
    .object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email address")
            .toLowerCase()
            .trim(),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({
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
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authClient.signUp.email({
                name:data.email,
                email:data.email,
                password:data.password,
                callbackURL:'/'
            })
            

            if (response.error) {
                if (response.error.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
                    setFormError("email", {
                        type: "manual",
                        message: "An account with this email already exists",
                    });
                    return;
                }

                throw new Error(response.error.message || "Failed to create account");
            }
            await authClient.signIn.email({
                email: data.email,
                password: data.password
            })
            // Successfully created account - redirect to dashboard or login
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

    const handleSocialSignup = async (provider: "google" | "github") => {
        setIsSocialLoading(provider);
        setError(null);

        try {
          

            authClient.signIn.social({
                provider: provider,
                callbackURL: '/'
            })
        } catch (err) {
            setError("Failed to initiate social sign up. Please try again.");
            setIsSocialLoading(null);
        }
    };

    return (
        <div
            className={cn("flex flex-col gap-6 font-hanken-grotesk", className)}
            {...props}
        >
            <div className="text-center">
                <h1 className="text-2xl font-bold font-space-grotesk">Forge</h1>
            </div>
            <Card className="overflow-hidden p-0 w-1/2 mx-auto">
                <CardContent className="grid p-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your email below to create your account
                                </p>
                            </div>

                            {error && (
                                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

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
                                {!errors.email && (
                                    <FieldDescription>
                                        We&apos;ll use this to contact you. We will not share your
                                        email with anyone else.
                                    </FieldDescription>
                                )}
                            </Field>

                            <Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
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
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            {...register("confirmPassword")}
                                            disabled={isLoading}
                                            aria-invalid={errors.confirmPassword ? "true" : "false"}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </Field>
                                </div>
                                {!errors.password && !errors.confirmPassword && (
                                    <FieldDescription>
                                        Must be at least 8 characters long.
                                    </FieldDescription>
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
                                                Creating account...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                </FlipText>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <div className="grid grid-cols-2 gap-4">
                                <FlipText>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        type="button"
                                        onClick={() => handleSocialSignup("google")}
                                        disabled={isLoading || isSocialLoading !== null}
                                    >
                                        {isSocialLoading === "google" ? (
                                            <IconLoader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <IconBrandGoogleFilled />
                                        )}
                                        <span className="sr-only">Sign up with Google</span>
                                    </Button>
                                </FlipText>
                                <FlipText>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        type="button"
                                        onClick={() => handleSocialSignup("github")}
                                        disabled={isLoading || isSocialLoading !== null}
                                    >
                                        {isSocialLoading === "github" ? (
                                            <IconLoader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <IconBrandGithubFilled />
                                        )}
                                        <span className="sr-only">Sign up with Github</span>
                                    </Button>
                                </FlipText>
                            </div>

                            <FieldDescription className="text-center">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Sign in
                                </Link>
                            </FieldDescription>
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