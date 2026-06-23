"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Building2, Loader2, AlertCircle, Check } from "lucide-react";
import Button from "@/components/ui/Button";

const requirements = [
  { id: "length", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (signInRes?.error) {
        router.push("/login");
        return;
      }
      router.push("/predictor");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Could not reach the server. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-radial px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-forest-900">
            <Building2 size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold text-white">
            EstatePredict
          </span>
        </Link>

        <div className="glass-panel-dark rounded-xl2 p-8">
          <h1 className="font-display text-2xl font-bold text-white">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-white/60">
            Get unlimited home valuations, saved to your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <FieldDark
              id="name"
              label="Full name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Jordan Lee"
            />
            <FieldDark
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <FieldDark
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <ul className="space-y-1 pl-1">
              {requirements.map((r) => {
                const met = r.test(password);
                return (
                  <li
                    key={r.id}
                    className={`flex items-center gap-1.5 text-xs ${
                      met ? "text-emerald-400" : "text-white/40"
                    }`}
                  >
                    <Check size={12} className={met ? "opacity-100" : "opacity-30"} />
                    {r.label}
                  </li>
                );
              })}
            </ul>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FieldDark({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-white/50">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-emerald-400 focus:bg-white/15"
      />
    </div>
  );
}
