import PredictorForm from "@/components/predictor/PredictorForm";

export default function PredictorPage() {
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <span className="field-label text-emerald-600">Predictor</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-900 sm:text-4xl">
          Estimate a property&apos;s value
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          Fill in the details below. Every field maps directly to a variable
          in the regression model — nothing is estimated or hidden.
        </p>
      </div>
      <PredictorForm />
    </div>
  );
}
