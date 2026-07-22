"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

type Mode = "login" | "signup";

const COPY: Record<
  Mode,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    submit: string;
    altText: string;
    altLinkLabel: string;
    altHref: string;
  }
> = {
  login: {
    eyebrow: "Welcome back",
    title: "Log in",
    subtitle: "Sign in to post, join groups and book services.",
    submit: "Log in",
    altText: "New to Malangeni Hub?",
    altLinkLabel: "Create an account",
    altHref: "/signup",
  },
  signup: {
    eyebrow: "Join the community",
    title: "Create account",
    subtitle: "One account for news, places, community and services.",
    submit: "Create account",
    altText: "Already have an account?",
    altLinkLabel: "Log in",
    altHref: "/login",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const { login, signup, status } = useAuth();
  const router = useRouter();
  const copy = COPY[mode];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in → no reason to be here.
  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signup({ name, email, password });
      } else {
        await login({ usernameOrEmail: email, password });
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[420px] py-14">
      <div className="mb-6 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gold">
          {copy.eyebrow}
        </span>
        <h1 className="mt-1.5 font-serif text-[34px] font-semibold tracking-[-0.5px]">
          {copy.title}
        </h1>
        <p className="mt-1 text-[14px] text-muted">{copy.subtitle}</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-card border border-line bg-card p-6"
      >
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-accent bg-accent-soft px-3.5 py-2.5 text-[13px] text-accent"
          >
            {error}
          </p>
        )}

        {mode === "signup" && (
          <Field
            id="name"
            label="Full name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={setName}
            placeholder="Thabo Mokoena"
            required
          />
        )}

        {mode === "login" ? (
          <Field
            id="identifier"
            label="Email or username"
            type="text"
            autoComplete="username"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com or username"
            required
          />
        ) : (
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
          />
        )}

        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          minLength={mode === "signup" ? 6 : undefined}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full cursor-pointer rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Please wait…" : copy.submit}
        </button>
      </form>

      <p className="mt-5 text-center text-[13.5px] text-muted">
        {copy.altText}{" "}
        <Link href={copy.altHref} className="font-semibold text-accent">
          {copy.altLinkLabel}
        </Link>
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  ...input
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange">) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-[14px] outline-none transition focus:border-accent focus:outline-2 focus:outline-accent"
        {...input}
      />
    </div>
  );
}
