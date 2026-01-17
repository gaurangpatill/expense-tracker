"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      toast.error(payload?.error ?? "Unable to sign up");
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      toast.error("Account created, but sign-in failed.");
      return;
    }

    router.replace(result?.url ?? "/dashboard");
  });

  return (
    <div className="w-full rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create your workspace</h1>
        <p className="text-sm text-neutral-500">Start tracking with a fresh set of defaults.</p>
      </div>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a secure password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-neutral-900">
          Sign in
        </Link>
      </p>
    </div>
  );
}
