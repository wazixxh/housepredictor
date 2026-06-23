"use client";

import { TrendingUp, TrendingDown, RotateCcw, Minus } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { PredictionApiResponse } from "@/types";

export default function ResultCard({
  result,
  onReset,
}: {
  result: PredictionApiResponse;
  onReset: () => void;
}) {
  // Strip base value, sort by absolute impact descending
  const rows = result.breakdown
    .filter((b) => b.label !== "Base value")
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.impact)), 1);

  const positiveTotal = rows.filter(r => r.impact > 0).reduce((s, r) => s + r.impact, 0);
  const negativeTotal = rows.filter(r => r.impact < 0).reduce((s, r) => s + r.impact, 0);

  return (
    <div className="animate-fade-up space-y-5">
      {/* ── Estimate hero card ── */}
      <Card dark className="bg-forest-900 text-white">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            <TrendingUp size={14} />
            Estimated value
          </span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
          >
            <RotateCcw size={12} />
            New estimate
          </button>
        </div>
        <p className="mt-4 font-display text-5xl font-bold tracking-tight">
          {formatCurrency(result.estimate)}
        </p>
        <p className="mt-2 text-sm text-white/60">
          Likely range:{" "}
          <span className="text-white/80">{formatCurrency(result.low)}</span>
          {" – "}
          <span className="text-white/80">{formatCurrency(result.high)}</span>
        </p>

        {/* Mini stat row */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
          <MiniStat label="Model R²" value={result.r2.toFixed(2)} />
          <MiniStat label="Avg. error" value={"±" + formatCurrency(result.mae)} />
          <MiniStat
            label="Net adjustments"
            value={formatCurrency(positiveTotal + negativeTotal)}
            signed
          />
        </div>
      </Card>

      {/* ── Factor breakdown ── */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-base font-semibold text-forest-900">
              Factor breakdown
            </h3>
            <p className="mt-0.5 text-xs text-ink-500">
              How much each feature raised or lowered the estimate vs. a typical King County home.
              Sorted by impact.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs text-ink-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              Adds value
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500" />
              Reduces value
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {rows.map((row) => {
            const pct = (Math.abs(row.impact) / maxAbs) * 100;
            const isPos = row.impact > 0;
            const isZero = row.impact === 0;

            return (
              <div key={row.label} className="group">
                {/* Label row */}
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-ink-700">{row.label}</span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
                      isZero
                        ? "text-ink-400"
                        : isPos
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {isZero ? (
                      <Minus size={11} />
                    ) : isPos ? (
                      <TrendingUp size={11} />
                    ) : (
                      <TrendingDown size={11} />
                    )}
                    {isZero
                      ? "No impact"
                      : (isPos ? "+" : "") + formatCurrency(row.impact)}
                  </span>
                </div>

                {/* Bar track */}
                <div className="relative h-5 w-full overflow-hidden rounded-full bg-forest-900/6">
                  {isZero ? (
                    <div className="absolute inset-y-0 left-1/2 w-px bg-forest-900/15" />
                  ) : (
                    <div
                      className={`absolute inset-y-0 rounded-full transition-all duration-500 ${
                        isPos ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${pct / 2}%`,
                        left: isPos ? "50%" : undefined,
                        right: isPos ? undefined : `${50 - pct / 2}%`,
                      }}
                    />
                  )}
                  {/* Center zero line */}
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-forest-900/20" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary footer */}
        <div className="mt-6 flex items-center justify-between rounded-xl bg-mint-100 px-4 py-3">
          <div className="flex gap-6 text-xs">
            <span className="text-ink-500">
              Positive factors{" "}
              <strong className="text-emerald-600">+{formatCurrency(positiveTotal)}</strong>
            </span>
            <span className="text-ink-500">
              Negative factors{" "}
              <strong className="text-red-600">{formatCurrency(negativeTotal)}</strong>
            </span>
          </div>
          <span className="text-xs font-semibold text-forest-900">
            = {formatCurrency(result.estimate)}
          </span>
        </div>
      </Card>
    </div>
  );
}

function MiniStat({
  label,
  value,
  signed,
}: {
  label: string;
  value: string;
  signed?: boolean;
}) {
  const isNeg = signed && value.startsWith("-");
  return (
    <div>
      <p className="text-[10px] text-white/40 uppercase tracking-wide">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${isNeg ? "text-red-400" : "text-white/90"}`}>
        {value}
      </p>
    </div>
  );
}
