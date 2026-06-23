"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Home, LineChart, LogOut, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAuthed = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <nav className="glass-panel flex items-center justify-between rounded-full px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-900 text-emerald-400">
              <Building2 size={16} strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-forest-900">
              EstatePredict
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {isAuthed && (
              <>
                <NavLink href="/predictor" active={pathname === "/predictor"}>
                  Predictor
                </NavLink>
                <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                  Dashboard
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <div className="h-9 w-20 animate-pulse rounded-full bg-forest-900/10" />
            ) : isAuthed ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-secondary !px-4 !py-2 text-xs"
              >
                <LogOut size={14} />
                Sign out
              </button>
            ) : (
              <>
                <Link href="/login" className="btn-secondary !px-4 !py-2 text-xs">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary !px-4 !py-2 text-xs">
                  Get started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-forest-900 text-white"
          : "text-ink-700 hover:bg-forest-900/5"
      )}
    >
      {href === "/predictor" ? <Home size={14} /> : <LineChart size={14} />}
      {children}
    </Link>
  );
}
