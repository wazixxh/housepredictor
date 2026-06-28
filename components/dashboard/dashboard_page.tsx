import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPredictionsForUser } from "@/lib/db";
import {
  StatsRow,
  PredictionHistory,
  PredictionComparison,
  EstimateTrend,
  PortfolioMetricsChart,
  PropertyDonut,
} from "@/components/dashboard/StatsCard";
import MarketTrendsChart from "@/components/dashboard/MarketTrendsChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const predictions = session?.user ? await getPredictionsForUser(session.user.id) : [];

  // Safe numeric parsing — handles string-formatted values
  const estimates = predictions.map((p) => {
    const n = typeof p.estimate === "string"
      ? parseFloat(String(p.estimate).replace(/[$,\s]/g, ""))
      : Number(p.estimate);
    return isNaN(n) ? 0 : n;
  });

  const count   = estimates.length;
  const average = count ? estimates.reduce((a, b) => a + b, 0) / count : 0;
  const highest = count ? Math.max(...estimates) : 0;
  const lowest  = count ? Math.min(...estimates) : 0;

  return (
    <div className="animate-fade-up space-y-7">
      <div>
        <span className="field-label text-emerald-600">Dashboard</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-900 sm:text-4xl">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          All your valuations in one place — compare properties, track your estimates, and watch the market.
        </p>
      </div>

      {/* 4 stat cards */}
      <StatsRow count={count} average={average} highest={highest} lowest={lowest} />

      {/* Portfolio bar chart — lowest / avg / highest */}
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

      {/* History list with export */}
      <div>
        <PredictionHistory items={predictions} />
      </div>
    </div>
  );
}
