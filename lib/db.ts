import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing.");
  return createClient(url, key, { auth: { persistSession: false } });
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

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

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data } = await getClient()
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();
  if (!data) return undefined;
  return { id: data.id, name: data.name, email: data.email, passwordHash: data.password_hash, createdAt: data.created_at };
}

export async function getUserById(id: string): Promise<User | undefined> {
  const { data } = await getClient()
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) return undefined;
  return { id: data.id, name: data.name, email: data.email, passwordHash: data.password_hash, createdAt: data.created_at };
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const existing = await getUserByEmail(params.email);
  if (existing) throw new Error("An account with that email already exists.");
  const passwordHash = await bcrypt.hash(params.password, 10);
  const id = generateId();
  const { data, error } = await getClient()
    .from("users")
    .insert({ id, name: params.name, email: params.email.toLowerCase(), password_hash: passwordHash })
    .select()
    .single();
  if (error || !data) throw new Error("Could not create account.");
  return { id: data.id, name: data.name, email: data.email, passwordHash: data.password_hash, createdAt: data.created_at };
}

export async function verifyPassword(email: string, password: string): Promise<User | null> {
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
  const id = generateId();
  const { data, error } = await getClient()
    .from("predictions")
    .insert({ id, user_id: userId, input, estimate })
    .select()
    .single();
  if (error || !data) throw new Error("Could not save prediction.");
  return { id: data.id, userId: data.user_id, input: data.input, estimate: data.estimate, createdAt: data.created_at };
}

export async function getPredictionsForUser(userId: string): Promise<SavedPrediction[]> {
  const { data } = await getClient()
    .from("predictions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (!data) return [];
  return data.map((d) => ({ id: d.id, userId: d.user_id, input: d.input, estimate: d.estimate, createdAt: d.created_at }));
}
