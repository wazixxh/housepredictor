"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import Card from "@/components/ui/Card";
import Slider from "@/components/ui/Slider";
import { formatCurrency } from "@/lib/utils";
import { BASE_COEFS, INTERCEPT, CITY_COEFS } from "@/lib/modelCoefficients";

// A simplified, client-side-only preview using Seattle as the reference city
// and fixed mid-range values for everything except living area + condition.
// This is intentionally a teaser, not the real model call -- the full
// 10-input version lives behind auth at /predictor.
const SEATTLE_COEF = CITY_COEFS["Seattle"];

export default function HeroEstimator() {
  const [sqft, setSqft] = useState(2000);
  const [condition, setCondition] = useState(3);

  const estimate = useMemo(() => {
    const value =
      INTERCEPT +
      BASE_COEFS.bedrooms * 3 +
      BASE_COEFS.bathrooms * 2 +
      BASE_COEFS.sqft_living * sqft +
      BASE_COEFS.sqft_lot * 6000 +
      BASE_COEFS.floors * 1.5 +
      BASE_COEFS.waterfront * 0 +
      BASE_COEFS.view * 0 +
      BASE_COEFS.condition * condition +
      BASE_COEFS.yr_built * 1985 +
      SEATTLE_COEF;
    return Math.max(0, Math.round(value));
  }, [sqft, condition]);

  return (
    <Card dark className="relative">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          Live preview
        </p>
        <span className="text-[10px] text-white/40">Seattle · 3bd / 2ba</span>
      </div>

      <p className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">
        {formatCurrency(estimate)}
      </p>
      <p className="mt-1 text-xs text-white/50">Estimated market value</p>

      <div className="mt-7 space-y-5">
        <Slider
          label="Living area"
          value={sqft}
          min={800}
          max={6000}
          step={100}
          onChange={setSqft}
          formatValue={(v) => `${v.toLocaleString()} sqft`}
        />
        <Slider
          label="Condition"
          value={condition}
          min={1}
          max={5}
          onChange={setCondition}
          formatValue={(v) => ["Poor", "Fair", "Average", "Good", "Excellent"][v - 1]}
        />
      </div>

      <div className="mt-7 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-white/60">
          <Lock size={13} />
          Sign up to use all 10 inputs + save results
        </p>
        <Link
          href="/signup"
          className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Unlock
          <ArrowRight size={12} />
        </Link>
      </div>
    </Card>
  );
}
