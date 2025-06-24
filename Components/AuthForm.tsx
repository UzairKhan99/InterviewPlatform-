"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { signin, signup } from "@/lib/actions/auth.action";
import { Button } from "@/Components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";

type FormType = "sign-in" | "sign-up";

// Reusable validation schema
const getSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  });

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const schema = getSchema(type);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      const result =
        type === "sign-up"
          ? await signup({
              name: values.name!,
              email: values.email,
              password: values.password,
            })
          : await signin({
              email: values.email,
              password: values.password,
            });

      if (result.success) {
        toast.success(type === "sign-up" ? "Account created!" : "Signed in!");
        router.push(type === "sign-up" ? "/sign-in" : "/HomePage");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch {
      toast.error("Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[350px] max-w-[450px] mx-auto my-10">
      <div className="card flex flex-col gap-4 py-8 px-6">
        <div className="flex justify-center gap-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={24}
            height={24}
            className="rounded-lg border"
          />
          <h2 className="text-lg font-bold">FastPrep</h2>
        </div>

        <h3 className="text-lg font-bold">
          Practice Job Interview Questions with AI
        </h3>
        <p className="text-sm text-muted-foreground">
          {isSignIn
            ? "Enter your email below to sign in"
            : "Create your account to get started"}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-black hover:bg-primary/90"
            >
              {isLoading
                ? "Loading..."
                : isSignIn
                ? "Sign in"
                : "Create Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-medium text-user-primary hover:underline"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
