import bcrypt from "bcryptjs";

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

// In-memory store — resets on server restart.
// Shape matches the Supabase schema in supabase/schema.sql so migration
// is a one-file swap when you're ready.
const users: User[] = [];
const predictions: SavedPrediction[] = [];
let userSeq = 1;
let predSeq  = 1;

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
  if (existing) throw new Error("An account with that email already exists.");
  const passwordHash = await bcrypt.hash(params.password, 10);
  const user: User = {
    id: String(userSeq++),
    name: params.name,
    email: params.email.toLowerCase(),
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
    id: String(predSeq++),
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

// Seed a demo account so reviewers can log in immediately:
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
