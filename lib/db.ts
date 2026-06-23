import bcrypt from "bcryptjs";

/**
 * ---------------------------------------------------------------------------
 * MOCK DATA LAYER
 * ---------------------------------------------------------------------------
 * This in-memory store exists so the app runs end-to-end with zero external
 * services. It deliberately mirrors the shape of two Supabase tables:
 *
 *   users        (id, name, email, password_hash, created_at)
 *   predictions  (id, user_id, input jsonb, estimate, created_at)
 *
 * SWAPPING TO SUPABASE
 * ---------------------------------------------------------------------------
 * 1. Run the SQL below in the Supabase SQL editor:
 *
 *    create table users (
 *      id uuid primary key default gen_random_uuid(),
 *      name text not null,
 *      email text unique not null,
 *      password_hash text not null,
 *      created_at timestamptz default now()
 *    );
 *
 *    create table predictions (
 *      id uuid primary key default gen_random_uuid(),
 *      user_id uuid references users(id) on delete cascade,
 *      input jsonb not null,
 *      estimate numeric not null,
 *      created_at timestamptz default now()
 *    );
 *
 * 2. Replace the function bodies below with calls to a Supabase client:
 *
 *    import { createClient } from "@supabase/supabase-js";
 *    const supabase = createClient(
 *      process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *      process.env.SUPABASE_SERVICE_ROLE_KEY!
 *    );
 *
 *    export async function getUserByEmail(email: string) {
 *      const { data } = await supabase.from("users").select("*").eq("email", email).single();
 *      return data;
 *    }
 *
 * Every function signature below is already what the rest of the app calls,
 * so no other file needs to change when you migrate.
 * ---------------------------------------------------------------------------
 */

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface SavedPrediction {
  id: string;
  userId: string;
  input: Record<string, unknown>;
  estimate: number;
  createdAt: string;
}

// Module-level store. Resets on server restart -- fine for a demo,
// not for production (hence the Supabase migration path above).
const users: User[] = [];
const predictions: SavedPrediction[] = [];
let userSeq = 1;
let predictionSeq = 1;

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function getUserById(id: string): Promise<User | undefined> {
  return users.find((u) => u.id === id);
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const existing = await getUserByEmail(params.email);
  if (existing) {
    throw new Error("An account with that email already exists.");
  }
  const passwordHash = await bcrypt.hash(params.password, 10);
  const user: User = {
    id: String(userSeq++),
    name: params.name,
    email: params.email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function savePrediction(
  userId: string,
  input: Record<string, unknown>,
  estimate: number
): Promise<SavedPrediction> {
  const record: SavedPrediction = {
    id: String(predictionSeq++),
    userId,
    input,
    estimate,
    createdAt: new Date().toISOString(),
  };
  predictions.push(record);
  return record;
}

export async function getPredictionsForUser(
  userId: string
): Promise<SavedPrediction[]> {
  return predictions
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Seed one demo account so reviewers can log in immediately:
// demo@estatepredict.com / demo1234
(async () => {
  if (users.length === 0) {
    await createUser({
      name: "Demo User",
      email: "demo@estatepredict.com",
      password: "demo1234",
    });
  }
})();
