"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, CartesianGrid, AreaChart, Area,
  ComposedChart, Line, Scatter, ZAxis, RadialBarChart, RadialBar,
} from "recharts";
import { TrendingUp, TrendingDown, Home, Target, Clock, ArrowUpRight, Minus } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  estimate: number;
  createdAt: string;
  input: Record<string, unknown>;
}

// ─── Stats row ────────────────────────────────────────────────────────────────

export function StatsRow({
  count, average, highest, lowest = 0,
}: {
  count: number; average: number; highest: number; lowest?: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={<Home size={16} />}         label="Total Estimates"  value={count ? String(count) : "—"}            sub="properties analysed"                                             accent="default" />
      <StatCard icon={<TrendingUp size={16} />}   label="Average Value"    value={count ? formatCurrency(average) : "—"}  sub="across all estimates"                                            accent="blue"    />
      <StatCard icon={<Target size={16} />}       label="Highest Value"    value={count ? formatCurrency(highest) : "—"}  sub={count ? `+${formatCurrency(highest - average)} vs avg` : "—"}   accent="green"   />
      <StatCard icon={<TrendingDown size={16} />} label="Lowest Value"     value={count && lowest ? formatCurrency(lowest) : "—"} sub={count && lowest ? `${formatCurrency(lowest - average)} vs avg` : "—"} accent="red" />
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent = "default" }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  accent?: "green" | "red" | "blue" | "default";
}) {
  const styles: Record<string, { wrap: string; icon: string }> = {
    green:   { wrap: "from-emerald-500/10 border-emerald-500/20", icon: "text-emerald-600 bg-emerald-50"  },
    red:     { wrap: "from-red-500/10 border-red-400/20",         icon: "text-red-500 bg-red-50"          },
    blue:    { wrap: "from-forest-900/10 border-forest-900/20",   icon: "text-forest-800 bg-forest-900/8" },
    default: { wrap: "from-forest-900/5 border-forest-900/10",    icon: "text-forest-700 bg-forest-900/5" },
  };
  const s = styles[accent];
  return (
    <div className={`relative overflow-hidden rounded-xl2 border bg-gradient-to-br to-transparent p-5 shadow-glass ${s.wrap}`}>
      <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full ${s.icon}`}>
        {icon}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-forest-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-400">{sub}</p>
    </div>
  );
}

// ─── Portfolio metrics visual ─────────────────────────────────────────────────
// Shows Lowest / Average / Highest as a grouped bar with range annotation.

export function PortfolioMetricsChart({
  count, average, highest, lowest = 0,
}: {
  count: number; average: number; highest: number; lowest?: number;
}) {
  if (count < 1) return null;

  const data = [
    { label: "Lowest",  value: lowest,  fill: "#f87171" },
    { label: "Average", value: average, fill: "#064e3b" },
    { label: "Highest", value: highest, fill: "#10b981" },
  ];

  const spread = highest - (lowest || 0);

  // Custom bar label rendered above each bar
  const CustomLabel = ({ x, y, width, value }: any) => (
    <text
      x={x + width / 2}
      y={y - 8}
      textAnchor="middle"
      fill="#064e3b"
      fontSize={11}
      fontWeight={600}
      fontFamily="inherit"
    >
      {formatCurrency(value)}
    </text>
  );

  // Custom tooltip
  const Tip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const diff = d.value - average;
    return (
      <div className="glass-panel rounded-xl px-4 py-3 text-xs shadow-glass-lg">
        <p className="font-semibold text-forest-900">{d.label}</p>
        <p className="mt-1 font-display text-base font-bold text-forest-900">{formatCurrency(d.value)}</p>
        {d.label !== "Average" && (
          <p className={`mt-1 font-medium ${diff > 0 ? "text-emerald-600" : "text-red-500"}`}>
            {diff > 0 ? "+" : ""}{formatCurrency(diff)} vs average
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <div className="mb-1 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-semibold text-forest-900">
            Portfolio value range
          </h3>
          <p className="mt-0.5 text-xs text-ink-400">
            Spread across your {count} estimate{count > 1 ? "s" : ""} — range of{" "}
            <span className="font-semibold text-forest-900">{formatCurrency(spread)}</span>
          </p>
        </div>
        <div className="flex gap-4 text-[11px] text-ink-400">
          {data.map((d) => (
            <span key={d.label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: d.fill }} />
              {d.label}
            </span>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 32, right: 24, left: 0, bottom: 0 }} barCategoryGap="35%">
          <CartesianGrid vertical={false} stroke="rgba(6,78,59,0.06)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#3f5c4f", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => "$" + formatCompactNumber(v)}
            tick={{ fontSize: 11, fill: "#3f5c4f" }}
            axisLine={false}
            tickLine={false}
            width={64}
            domain={[0, (dataMax: number) => Math.round(dataMax * 1.15)]}
          />
          <Tooltip content={<Tip />} cursor={{ fill: "rgba(6,78,59,0.04)" }} />
          {/* Average reference line */}
          <ReferenceLine
            y={average}
            stroke="#064e3b"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            strokeOpacity={0.3}
            label={{ value: "avg", position: "insideTopRight", fontSize: 10, fill: "#064e3b", opacity: 0.5 }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72} label={<CustomLabel />}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} fillOpacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Range strip below chart */}
      {count > 1 && (
        <div className="mt-2 overflow-hidden rounded-full bg-forest-900/6" style={{ height: 6 }}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-400 via-forest-900 to-emerald-500"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </Card>
  );
}

// ─── Comparison bar chart ─────────────────────────────────────────────────────

export function PredictionComparison({ items }: { items: HistoryItem[] }) {
  if (items.length < 2) return null;

  const avg = items.reduce((s, i) => s + i.estimate, 0) / items.length;

  const data = [...items].reverse().slice(0, 8).map((item, i) => {
    const inp = item.input;
    return {
      label: `${String(inp.city ?? "?").split(" ")[0]} #${i + 1}`,
      city:  String(inp.city ?? "Unknown"),
      beds:  String(inp.bedrooms ?? "?"),
      baths: String(inp.bathrooms ?? "?"),
      sqft:  Number(inp.sqftLiving ?? 0),
      estimate: item.estimate,
      vsAvg: Math.round(item.estimate - avg),
      date:  new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    };
  });

  const Tip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="glass-panel rounded-xl px-4 py-3 text-xs shadow-glass-lg">
        <p className="font-display font-semibold text-forest-900">{formatCurrency(d.estimate)}</p>
        <p className="mt-1 text-ink-500">{d.city} · {d.beds}bd / {d.baths}ba</p>
        <p className="text-ink-400">{d.sqft.toLocaleString()} sqft · {d.date}</p>
        {d.vsAvg !== 0 && (
          <p className={`mt-1.5 font-semibold ${d.vsAvg > 0 ? "text-emerald-600" : "text-red-500"}`}>
            {d.vsAvg > 0 ? "+" : ""}{formatCurrency(d.vsAvg)} vs avg
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-forest-900">Estimates comparison</h3>
          <p className="mt-0.5 text-xs text-ink-400">
            Last {data.length} predictions · dashed line = your average ({formatCurrency(avg)})
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-ink-400">
          <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-emerald-500" /> Above avg</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-red-400" /> Below avg</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(6,78,59,0.06)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#3f5c4f" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => "$" + formatCompactNumber(v)} tick={{ fontSize: 11, fill: "#3f5c4f" }} axisLine={false} tickLine={false} width={60} />
          <Tooltip content={<Tip />} cursor={{ fill: "rgba(6,78,59,0.04)" }} />
          <ReferenceLine y={avg} stroke="#064e3b" strokeDasharray="4 3" strokeWidth={1.5} strokeOpacity={0.35} />
          <Bar dataKey="estimate" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.vsAvg >= 0 ? "#10b981" : "#f87171"} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Trend over time ──────────────────────────────────────────────────────────

export function EstimateTrend({ items }: { items: HistoryItem[] }) {
  if (items.length < 3) return null;

  const data = [...items].reverse().map((item, i) => ({
    idx: i + 1,
    estimate: item.estimate,
    label: new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  }));

  return (
    <Card>
      <div className="mb-5">
        <h3 className="font-display text-base font-semibold text-forest-900">Estimate trend</h3>
        <p className="mt-0.5 text-xs text-ink-400">How your predicted values have moved over time</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(6,78,59,0.06)" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#3f5c4f" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => "$" + formatCompactNumber(v)} tick={{ fontSize: 10, fill: "#3f5c4f" }} axisLine={false} tickLine={false} width={56} />
          <Tooltip
            formatter={(v: number) => [formatCurrency(v), "Estimate"]}
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(6,78,59,0.1)", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="estimate" stroke="#10b981" strokeWidth={2.5}
            fill="url(#emeraldGrad)"
            dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "#064e3b" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── History list ─────────────────────────────────────────────────────────────

export function PredictionHistory({ items }: { items: HistoryItem[] }) {
  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Clock size={20} />
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-forest-900">No estimates yet</h3>
        <p className="mt-1 max-w-xs text-sm text-ink-500">Run your first prediction and it will appear here automatically.</p>
        <a href="/predictor" className="btn-primary mt-5 !px-5 !py-2.5 text-xs">Go to predictor</a>
      </Card>
    );
  }

  const max = Math.max(...items.map((i) => i.estimate));
  const avg = items.reduce((s, i) => s + i.estimate, 0) / items.length;

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="border-b border-forest-900/6 px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-forest-900">All estimates</h3>
      </div>
      <div className="divide-y divide-forest-900/5">
        {items.map((item) => {
          const inp = item.input as Record<string, unknown>;
          const diff = item.estimate - avg;
          const pct  = (item.estimate / max) * 100;
          return (
            <div key={item.id} className="group px-5 py-4 transition-colors hover:bg-emerald-50/50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-forest-900">
                    {String(inp.city ?? "Unknown")} · {String(inp.bedrooms ?? "?")}bd / {String(inp.bathrooms ?? "?")}ba
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {Number(inp.sqftLiving ?? 0).toLocaleString()} sqft ·{" "}
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm font-bold text-forest-900 tabular-nums">{formatCurrency(item.estimate)}</p>
                  <p className={`flex items-center justify-end gap-0.5 text-[10px] font-medium ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-ink-400"}`}>
                    {diff > 0 ? <ArrowUpRight size={9} /> : diff < 0 ? <TrendingDown size={9} /> : <Minus size={9} />}
                    {diff === 0 ? "at avg" : `${diff > 0 ? "+" : ""}${formatCurrency(diff)} vs avg`}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-forest-900/8">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
