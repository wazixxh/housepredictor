"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, CartesianGrid, AreaChart, Area, PieChart, Pie,
} from "recharts";
import { TrendingUp, TrendingDown, Home, Target, Clock, ArrowUpRight, Minus, Download } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  estimate: number;
  createdAt: string;
  input: Record<string, unknown>;
}

// Safe number parser — strips "$", commas, spaces before converting
function safeNum(val: unknown): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[$,\s]/g, "");
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

// Stable date formatter — no locale mismatch between server/client
function fmtDate(iso: string, includeYear = false) {
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const base = `${months[d.getMonth()]} ${d.getDate()}`;
  return includeYear ? `${base}, ${d.getFullYear()}` : base;
}

// Export predictions to CSV
function exportCSV(items: HistoryItem[]) {
  const headers = ["City","Bedrooms","Bathrooms","Sqft Living","Estimate","Date"];
  const rows = items.map((item) => {
    const inp = item.input as Record<string, unknown>;
    return [
      String(inp.city ?? ""),
      String(inp.bedrooms ?? ""),
      String(inp.bathrooms ?? ""),
      String(inp.sqftLiving ?? ""),
      String(item.estimate),
      fmtDate(item.createdAt, true),
    ].join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "estatepredict-estimates.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Stats row ────────────────────────────────────────────────────────────────

export function StatsRow({
  count, average, highest, lowest,
}: {
  count: number; average: number; highest: number; lowest: number;
}) {
  // Safely parse all values in case they come in as strings
  const avg = safeNum(average);
  const hi  = safeNum(highest);
  const lo  = safeNum(lowest);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={<Home size={16} />}         label="Total Estimates" value={count ? String(count) : "—"}      sub="properties analysed"                                         accent="default" />
      <StatCard icon={<TrendingUp size={16} />}   label="Average Value"   value={count ? formatCurrency(avg) : "—"} sub="across all estimates"                                       accent="blue"    />
      <StatCard icon={<Target size={16} />}       label="Highest Value"   value={count ? formatCurrency(hi) : "—"}  sub={count ? `+${formatCurrency(hi - avg)} vs avg` : "—"}        accent="green"   />
      <StatCard icon={<TrendingDown size={16} />} label="Lowest Value"    value={count ? formatCurrency(lo) : "—"}  sub={count ? `${formatCurrency(lo - avg)} vs avg` : "—"}         accent="red"     />
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
      <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full ${s.icon}`}>{icon}</div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-forest-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-400">{sub}</p>
    </div>
  );
}

// ─── Portfolio metrics chart ──────────────────────────────────────────────────

export function PortfolioMetricsChart({ count, average, highest, lowest }: {
  count: number; average: number; highest: number; lowest: number;
}) {
  if (count < 1) return null;
  const avg = safeNum(average);
  const hi  = safeNum(highest);
  const lo  = safeNum(lowest);

  const data = [
    { label: "Lowest",  value: lo,  fill: "#f87171" },
    { label: "Average", value: avg, fill: "#064e3b" },
    { label: "Highest", value: hi,  fill: "#10b981" },
  ];

  const CustomLabel = ({ x, y, width, value }: any) => (
    <text x={x + width / 2} y={y - 8} textAnchor="middle"
      fill="#064e3b" fontSize={11} fontWeight={600} fontFamily="inherit">
      {formatCurrency(value)}
    </text>
  );

  const Tip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const diff = d.value - avg;
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
          <h3 className="font-display text-base font-semibold text-forest-900">Portfolio value range</h3>
          <p className="mt-0.5 text-xs text-ink-400">
            Spread across your {count} estimate{count > 1 ? `s — range of ${formatCurrency(hi - lo)}` : ""}
          </p>
        </div>
        <div className="flex gap-4 text-[11px] text-ink-400">
          {data.map((d) => (
            <span key={d.label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: d.fill }} />{d.label}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 32, right: 24, left: 0, bottom: 0 }} barCategoryGap="35%">
          <CartesianGrid vertical={false} stroke="rgba(6,78,59,0.06)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#3f5c4f", fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => "$" + formatCompactNumber(v)} tick={{ fontSize: 11, fill: "#3f5c4f" }}
            axisLine={false} tickLine={false} width={64}
            domain={[0, (dataMax: number) => Math.round(dataMax * 1.15)]} />
          <Tooltip content={<Tip />} cursor={{ fill: "rgba(6,78,59,0.04)" }} />
          <ReferenceLine y={avg} stroke="#064e3b" strokeDasharray="5 3" strokeWidth={1.5} strokeOpacity={0.3}
            label={{ value: "avg", position: "insideTopRight", fontSize: 10, fill: "#064e3b", opacity: 0.5 }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72} label={<CustomLabel />}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.9} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {count > 1 && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-forest-900/6">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-red-400 via-forest-900 to-emerald-500" />
        </div>
      )}
    </Card>
  );
}

// ─── Comparison bar chart ─────────────────────────────────────────────────────

export function PredictionComparison({ items }: { items: HistoryItem[] }) {
  if (items.length < 2) return null;
  const avg = items.reduce((s, i) => s + safeNum(i.estimate), 0) / items.length;

  const data = [...items].reverse().slice(0, 8).map((item, i) => {
    const inp = item.input;
    return {
      label: `${String(inp.city ?? "?").split(" ")[0]} #${i + 1}`,
      city:  String(inp.city ?? "Unknown"),
      beds:  String(inp.bedrooms ?? "?"),
      baths: String(inp.bathrooms ?? "?"),
      sqft:  safeNum(inp.sqftLiving),
      estimate: safeNum(item.estimate),
      vsAvg: Math.round(safeNum(item.estimate) - avg),
      date:  fmtDate(item.createdAt),
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
            Last {data.length} predictions · dashed = your average ({formatCurrency(avg)})
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
            {data.map((d, i) => <Cell key={i} fill={d.vsAvg >= 0 ? "#10b981" : "#f87171"} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Estimate trend ───────────────────────────────────────────────────────────

export function EstimateTrend({ items }: { items: HistoryItem[] }) {
  if (items.length < 3) return null;
  const data = [...items].reverse().map((item, i) => ({
    idx: i + 1,
    estimate: safeNum(item.estimate),
    label: fmtDate(item.createdAt),
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

// ─── Property distribution donut ──────────────────────────────────────────────

export function PropertyDonut({ items }: { items: HistoryItem[] }) {
  if (items.length < 1) return null;

  // Group by city
  const cityMap: Record<string, number> = {};
  items.forEach((item) => {
    const city = String((item.input as Record<string, unknown>).city ?? "Unknown");
    cityMap[city] = (cityMap[city] ?? 0) + 1;
  });

  const COLORS = ["#10b981","#064e3b","#34d399","#047857","#6ee7b7","#065f46"];
  const data = Object.entries(cityMap).map(([name, value], i) => ({
    name, value, fill: COLORS[i % COLORS.length],
  }));

  const Tip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-panel rounded-xl px-3 py-2 text-xs shadow-glass-lg">
        <p className="font-semibold text-forest-900">{payload[0].name}</p>
        <p className="text-ink-500">{payload[0].value} propert{payload[0].value > 1 ? "ies" : "y"}</p>
      </div>
    );
  };

  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-forest-900">Properties by city</h3>
      <p className="mt-0.5 text-xs text-ink-400">Distribution of your estimates across locations</p>

      <div className="mt-4 flex items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-forest-900">{items.length}</span>
            <span className="text-[10px] text-ink-400">propert{items.length > 1 ? "ies" : "y"}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-xs text-ink-700">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.fill }} />
                {d.name}
              </span>
              <span className="text-xs font-semibold text-forest-900">
                {d.value} ({Math.round((d.value / items.length) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
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

  const estimates = items.map((i) => safeNum(i.estimate));
  const max = Math.max(...estimates);
  const avg = estimates.reduce((a, b) => a + b, 0) / estimates.length;

  return (
    <Card className="!p-0 overflow-hidden">
      {/* Header with export button */}
      <div className="flex items-center justify-between border-b border-forest-900/6 px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-forest-900">All estimates</h3>
        <button
          onClick={() => exportCSV(items)}
          className="flex items-center gap-1.5 rounded-full border border-forest-900/12 bg-white px-3 py-1.5 text-[11px] font-semibold text-forest-900 shadow-sm transition-all hover:border-emerald-500 hover:text-emerald-600 active:scale-95"
        >
          <Download size={12} />
          Export CSV
        </button>
      </div>

      <div className="divide-y divide-forest-900/5">
        {items.map((item) => {
          const inp = item.input as Record<string, unknown>;
          const est  = safeNum(item.estimate);
          const diff = est - avg;
          const pct  = (est / max) * 100;

          return (
            <div key={item.id} className="group px-5 py-4 transition-colors hover:bg-emerald-50/50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-forest-900">
                    {String(inp.city ?? "Unknown")} · {String(inp.bedrooms ?? "?")}bd / {String(inp.bathrooms ?? "?")}ba
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {safeNum(inp.sqftLiving).toLocaleString()} sqft · {fmtDate(item.createdAt, true)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm font-bold text-forest-900 tabular-nums">
                    {formatCurrency(est)}
                  </p>
                  {/* Color-coded badge */}
                  <span className={`mt-1 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    diff > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : diff < 0
                      ? "bg-red-50 text-red-600"
                      : "bg-forest-900/5 text-ink-400"
                  }`}>
                    {diff > 0 ? <ArrowUpRight size={9} /> : diff < 0 ? <TrendingDown size={9} /> : <Minus size={9} />}
                    {diff === 0 ? "at avg" : `${diff > 0 ? "+" : ""}${formatCurrency(diff)} vs avg`}
                  </span>
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
