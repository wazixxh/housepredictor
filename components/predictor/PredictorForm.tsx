"use client";

import { useState } from "react";
import { Waves, Loader2, AlertCircle, Calculator } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { CITIES } from "@/lib/cities";
import type { PredictionFormValues, PredictionApiResponse } from "@/types";
import ResultCard from "./ResultCard";

const VIEW_LABELS = ["None", "Fair", "Average", "Good", "Excellent"];
const CONDITION_LABELS = ["Poor", "Fair", "Average", "Good", "Excellent"];

const initialValues: PredictionFormValues = {
  bedrooms: 3,
  bathrooms: 2,
  sqftLiving: 2000,
  sqftLot: 6000,
  floors: 1.5,
  waterfront: false,
  view: 0,
  condition: 3,
  yearBuilt: 1990,
  city: "Seattle",
};

export default function PredictorForm() {
  const [values, setValues] = useState<PredictionFormValues>(initialValues);
  const [result, setResult] = useState<PredictionApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof PredictionFormValues>(
    key: K,
    value: PredictionFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not generate an estimate.");
        setLoading(false);
        return;
      }
      setResult(data);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ResultCard
        result={result}
        onReset={() => {
          setResult(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      <Card className="space-y-7">
        <div className="grid gap-6 sm:grid-cols-2">
          <Slider
            label="Bedrooms"
            value={values.bedrooms}
            min={0}
            max={10}
            onChange={(v) => update("bedrooms", v)}
          />
          <Slider
            label="Bathrooms"
            value={values.bathrooms}
            min={0}
            max={8}
            step={0.25}
            onChange={(v) => update("bathrooms", v)}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Slider
            label="Living area"
            value={values.sqftLiving}
            min={300}
            max={10000}
            step={50}
            onChange={(v) => update("sqftLiving", v)}
            formatValue={(v) => `${v.toLocaleString()} sqft`}
          />
          <Slider
            label="Lot size"
            value={values.sqftLot}
            min={500}
            max={200000}
            step={500}
            onChange={(v) => update("sqftLot", v)}
            formatValue={(v) => `${v.toLocaleString()} sqft`}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Slider
            label="Floors"
            value={values.floors}
            min={1}
            max={3.5}
            step={0.5}
            onChange={(v) => update("floors", v)}
          />
          <Slider
            label="Year built"
            value={values.yearBuilt}
            min={1900}
            max={2026}
            onChange={(v) => update("yearBuilt", v)}
            formatValue={(v) => `${v}`}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Slider
            label="View quality"
            value={values.view}
            min={0}
            max={4}
            onChange={(v) => update("view", v)}
            formatValue={(v) => VIEW_LABELS[v]}
          />
          <Slider
            label="Condition"
            value={values.condition}
            min={1}
            max={5}
            onChange={(v) => update("condition", v)}
            formatValue={(v) => CONDITION_LABELS[v - 1]}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="city" className="field-label block">
              City
            </label>
            <select
              id="city"
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              className="field-input"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="field-label block">Waterfront</span>
            <button
              type="button"
              onClick={() => update("waterfront", !values.waterfront)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                values.waterfront
                  ? "border-emerald-500 bg-emerald-50 text-forest-900"
                  : "border-forest-900/10 bg-white/80 text-ink-500"
              }`}
            >
              <span className="flex items-center gap-2">
                <Waves size={16} />
                {values.waterfront ? "Yes, on the water" : "No waterfront access"}
              </span>
              <span
                className={`h-5 w-9 rounded-full transition-colors ${
                  values.waterfront ? "bg-emerald-500" : "bg-forest-900/15"
                } relative`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    values.waterfront ? "left-4" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Calculator size={16} />
          )}
          Calculate estimate
        </Button>
      </Card>

      <Card className="h-fit bg-mint-100/80">
        <h3 className="font-display text-sm font-semibold text-forest-900">
          Why these ten fields?
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          These are exactly the variables the regression model was trained
          on. Square footage and location tend to carry the most weight;
          condition and view add meaningful adjustments on top.
        </p>
        <div className="mt-5 space-y-3 border-t border-forest-900/10 pt-4 text-xs text-ink-700">
          <Row label="Model type" value="Multiple Linear Regression" />
          <Row label="Training records" value="4,600 home sales" />
          <Row label="R² (accuracy)" value="0.78" />
          <Row label="Avg. error" value="≈ $71,766" />
        </div>
      </Card>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-forest-900">{value}</span>
    </div>
  );
}
