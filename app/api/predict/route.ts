import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { predictPrice } from "@/lib/model";
import { savePrediction } from "@/lib/db";
import { CITIES } from "@/lib/cities";

const predictSchema = z.object({
  bedrooms: z.number().min(0).max(15),
  bathrooms: z.number().min(0).max(12),
  sqftLiving: z.number().min(100).max(20000),
  sqftLot: z.number().min(100).max(2000000),
  floors: z.number().min(1).max(4),
  waterfront: z.boolean(),
  view: z.number().min(0).max(4),
  condition: z.number().min(1).max(5),
  yearBuilt: z.number().min(1900).max(2026),
  city: z.enum(CITIES as unknown as [string, ...string[]]),
});

export async function POST(request: Request) {
  // Defense in depth: middleware already blocks unauthenticated requests
  // to /predictor, but the API route is checked independently too.
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = predictSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid input.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const result = predictPrice(parsed.data);

  await savePrediction(session.user.id, parsed.data, result.estimate);

  return NextResponse.json(result);
}
