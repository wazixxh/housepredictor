import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import HeroEstimator from "@/components/HeroEstimator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-mint-fade">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-radial pb-24 pt-16 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-24 top-10 h-72 w-72 animate-float rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 animate-float rounded-full bg-emerald-400/20 blur-3xl [animation-delay:2s]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-12">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-emerald-300">
                <Sparkles size={13} />
                Trained on 4,600+ King County home sales
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Know what a home is{" "}
                <span className="text-emerald-400">actually worth</span> —
                before you make an offer.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
                EstatePredict runs a multiple linear regression model against
                ten real valuation drivers — square footage, condition,
                waterfront access, neighborhood, and more — to return a
                defensible price estimate in seconds, not a guess.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/signup" className="btn-primary">
                  Get your free estimate
                  <ArrowRight size={16} />
                </Link>
                <Link href="/login" className="btn-ghost-dark">
                  I already have an account
                </Link>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
                <Stat value="0.69" label="R² accuracy" />
                <Stat value="±$87K" label="Avg. error" />
                <Stat value="44" label="Cities covered" />
              </dl>
            </div>

            <div className="animate-fade-up [animation-delay:150ms]">
              <HeroEstimator />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="field-label text-emerald-600">How it works</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest-900 sm:text-4xl">
            Ten inputs. One regression model. A real number.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<MapPin size={20} />}
            title="Describe the property"
            body="Bedrooms, bathrooms, square footage, lot size, floors, condition, view, year built, waterfront access, and city — the same fields a real appraiser would ask for."
          />
          <FeatureCard
            icon={<TrendingUp size={20} />}
            title="The model runs instantly"
            body="A multiple linear regression model, trained and validated on thousands of real closed sales, weighs every input and returns an estimate with a confidence range."
          />
          <FeatureCard
            icon={<ShieldCheck size={20} />}
            title="Save and track"
            body="Every estimate is saved to your private dashboard, so you can compare properties side by side as you shop or list."
          />
        </div>
      </section>

      {/* MODEL TRANSPARENCY */}
      <section className="bg-forest-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="field-label text-emerald-400">
                Built on real data, not vibes
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                We show our work.
              </h2>
              <p className="mt-5 text-white/70">
                Most valuation tools are black boxes. EstatePredict is built
                on an interpretable multiple linear regression model — every
                estimate can be broken down into exactly how much each factor
                added or subtracted from the final price.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  R² of 0.69 against held-out test sales
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  Average absolute error of roughly $71,766
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  Trained on outlier-filtered sales across 44 King County cities
                </li>
              </ul>
            </div>
            <Card dark className="font-mono text-xs leading-relaxed text-emerald-100/90">
              <p className="mb-3 text-emerald-400">// simplified model output</p>
              <p>price ≈ intercept</p>
              <p>&nbsp;&nbsp;+ β₁·bedrooms + β₂·bathrooms</p>
              <p>&nbsp;&nbsp;+ β₃·sqft_living + β₄·sqft_lot</p>
              <p>&nbsp;&nbsp;+ β₅·floors + β₆·waterfront</p>
              <p>&nbsp;&nbsp;+ β₇·view + β₈·condition</p>
              <p>&nbsp;&nbsp;+ β₉·yr_built + β_city</p>
              <p className="mt-4 text-white/50">
                Coefficients are fit via ordinary least squares on cleaned,
                outlier-filtered training data.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-bold text-forest-900 sm:text-4xl">
          Ready to see what your next home is worth?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-500">
          Create a free account and get unlimited estimates, saved to your
          personal dashboard.
        </p>
        <div className="mt-8">
          <Link href="/signup" className="btn-primary">
            Create your account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-bold text-white">{value}</dt>
      <dd className="mt-1 text-xs text-white/50">{label}</dd>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="h-full transition-transform hover:-translate-y-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-forest-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
    </Card>
  );
}
