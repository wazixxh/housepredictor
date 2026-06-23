import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPredictionsForUser } from "@/lib/db";
import { StatsRow, PredictionHistory } from "@/components/dashboard/StatsCard";
import MarketTrendsChart from "@/components/dashboard/MarketTrendsChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const predictions = session?.user
    ? await getPredictionsForUser(session.user.id)
    : [];

  const estimates = predictions.map((p) => p.estimate);
  const average = estimates.length
    ? estimates.reduce((a, b) => a + b, 0) / estimates.length
    : 0;
  const highest = estimates.length ? Math.max(...estimates) : 0;

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <span className="field-label text-emerald-600">Dashboard</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-900 sm:text-4xl">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          A quick overview of your saved valuations and where the market is moving.
        </p>
      </div>

      <StatsRow count={predictions.length} average={average} highest={highest} />

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">
            Recent estimates
          </h2>
          <PredictionHistory items={predictions} />
        </div>
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">
            Market trends
          </h2>
          <MarketTrendsChart />
        </div>
      </div>
    </div>
  );
}
