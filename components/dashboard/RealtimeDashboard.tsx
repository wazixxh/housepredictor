"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Trash2 } from "lucide-react";
import {
  StatsRow,
  PredictionHistory,
  PredictionComparison,
  EstimateTrend,
  PortfolioMetricsChart,
  PropertyDonut,
  type HistoryItem,
} from "@/components/dashboard/StatsCard";
import MarketTrendsChart from "@/components/dashboard/MarketTrendsChart";

function safeNum(val: unknown): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (typeof val === "string") {
    const n = parseFloat(val.replace(/[$,\s]/g, ""));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

interface Props {
  userId: string;
  userName: string;
  initialPredictions: HistoryItem[];
}

export default function RealtimeDashboard({ userId, userName, initialPredictions }: Props) {
  const [predictions, setPredictions] = useState<HistoryItem[]>(initialPredictions);
  const [isLive, setIsLive]           = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [clearing, setClearing]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Supabase Realtime subscription
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || !userId) return;

    const supabase = createClient(url, key);

    const channel = supabase
      .channel("predictions-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "predictions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const d = payload.new as Record<string, unknown>;
          const newItem: HistoryItem = {
            id:        String(d.id),
            input:     d.input as Record<string, unknown>,
            estimate:  safeNum(d.estimate),
            createdAt: String(d.created_at),
          };
          setPredictions((prev) => [newItem, ...prev]);
          setJustUpdated(true);
          setTimeout(() => setJustUpdated(false), 3000);
        }
      )
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED");
      });

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Reset all predictions for this user
  async function handleClear() {
    if (!showConfirm) {
      setShowConfirm(true);
      // Auto-cancel confirm after 4 seconds
      setTimeout(() => setShowConfirm(false), 4000);
      return;
    }
    setClearing(true);
    try {
      await fetch("/api/predictions/clear", { method: "DELETE" });
      setPredictions([]);
    } finally {
      setClearing(false);
      setShowConfirm(false);
    }
  }

  const estimates = predictions.map((p) => safeNum(p.estimate));
  const count     = estimates.length;
  const average   = count ? estimates.reduce((a, b) => a + b, 0) / count : 0;
  const highest   = count ? Math.max(...estimates) : 0;
  const lowest    = count ? Math.min(...estimates) : 0;

  return (
    <div className="animate-fade-up space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="field-label text-emerald-600">Dashboard</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-forest-900 sm:text-4xl">
            Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-500">
            All your valuations in one place — compare properties, track your estimates, and watch the market.
          </p>
        </div>

        {/* Controls: Reset + Live indicator */}
        <div className="flex shrink-0 items-center gap-3 pt-1">
          {/* Reset button */}
          <button
            onClick={handleClear}
            disabled={clearing || count === 0}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40 ${
              showConfirm
                ? "border-red-400 bg-red-50 text-red-600 scale-105"
                : "border-forest-900/15 bg-white text-ink-600 hover:border-red-300 hover:text-red-500"
            }`}
          >
            <Trash2 size={12} />
            {clearing ? "Clearing..." : showConfirm ? "Confirm reset?" : "Reset all"}
          </button>

          {/* Live dot */}
          <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            justUpdated
              ? "bg-emerald-500 text-white scale-105"
              : isLive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-forest-900/5 text-ink-400"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              justUpdated ? "bg-white" : isLive ? "bg-emerald-500 animate-pulse" : "bg-ink-300"
            }`} />
            {justUpdated ? "Updated!" : isLive ? "Live" : "Connecting..."}
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsRow count={count} average={average} highest={highest} lowest={lowest} />

      {/* Portfolio chart */}
      {count >= 1 && (
        <PortfolioMetricsChart count={count} average={average} highest={highest} lowest={lowest} />
      )}

      {/* Per-prediction comparison */}
      {count >= 2 && <PredictionComparison items={predictions} />}

      {/* Trend + market + donut */}
      <div className="grid gap-6 lg:grid-cols-2">
        {count >= 3 && <EstimateTrend items={predictions} />}
        <MarketTrendsChart />
        {count >= 1 && <PropertyDonut items={predictions} />}
      </div>

      {/* History */}
      <PredictionHistory items={predictions} />

    </div>
  );
}
