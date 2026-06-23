"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "@/components/ui/Card";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

// Real average sale prices by city, computed from the training dataset
// (data.xlsx), not synthetic placeholder data.
const MARKET_DATA = [
  { city: "Medina", avg: 2046559 },
  { city: "Clyde Hill", avg: 1615711 },
  { city: "Yarrow Point", avg: 1194838 },
  { city: "Mercer Island", avg: 1178638 },
  { city: "Bellevue", avg: 862255 },
  { city: "Beaux Arts Village", avg: 745000 },
  { city: "Sammamish", avg: 702986 },
  { city: "Fall City", avg: 692682 },
];

export default function MarketTrendsChart() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-forest-900">
            Highest-value markets
          </h3>
          <p className="mt-1 text-xs text-ink-500">
            Average closed sale price by city, from the model&apos;s training data.
          </p>
        </div>
      </div>
      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MARKET_DATA} margin={{ top: 8, right: 8, left: -16 }}>
            <CartesianGrid vertical={false} stroke="rgba(6,78,59,0.08)" />
            <XAxis
              dataKey="city"
              tick={{ fontSize: 10, fill: "#3f5c4f" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={(v) => formatCompactNumber(v)}
              tick={{ fontSize: 10, fill: "#3f5c4f" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(6,78,59,0.1)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="avg" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
