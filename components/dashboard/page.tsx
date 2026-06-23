import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPredictionsForUser } from "@/lib/db";
import {
  StatsRow,
  PredictionHistory,
  PredictionComparison,
  EstimateTrend,
  PortfolioMetricsChart,
} from "@/components/dashboard/StatsCard";
import MarketTrendsChart from "@/components/dashboard/MarketTrendsChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const predictions = session?.user ? await getPredictionsForUser(session.user.id) : [];

  const estimates = predictions.map((p) => p.estimate);
  const average = estimates.length ? estimates.reduce((a, b) => a + b, 0) / estimates.length : 0;
  const highest = estimates.length ? Math.max(...estimates) : 0;
  const lowest  = estimates.length ? Math.min(...estimates) : 0;

  return (
    <div className="animate-fade-up space-y-7">

      {/* Header */}
      <div>
        <span className="field-label text-emerald-600">Dashboard</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-900 sm:text-4xl">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          All your valuations in one place — compare properties, track your estimates, and watch the market.
        </p>
      </div>

      {/* Stat cards */}
      <StatsRow count={predictions.length} average={average} highest={highest} lowest={lowest} />

      {/* Portfolio metrics bar chart (lowest / avg / highest) — 1+ estimates */}
      {predictions.length >= 1 && (
        <PortfolioMetricsChart
          count={predictions.length}
          average={average}
          highest={highest}
          lowest={lowest}
        />
      )}

      {/* Per-prediction comparison — 2+ estimates */}
      {predictions.length >= 2 && <PredictionComparison items={predictions} />}

      {/* Trend + market side by side — 3+ estimates */}
      {predictions.length >= 3 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <EstimateTrend items={predictions} />
          <MarketTrendsChart />
        </div>
      ) : (
        <MarketTrendsChart />
      )}

      {/* Full history list */}
      <div>
        <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">All estimates</h2>
        <PredictionHistory items={predictions} />
      </div>

    </div>
  );
}
