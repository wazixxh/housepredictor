import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPredictionsForUser } from "@/lib/db";
import RealtimeDashboard from "@/components/dashboard/RealtimeDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const predictions = session?.user ? await getPredictionsForUser(session.user.id) : [];

  return (
    <RealtimeDashboard
      userId={session?.user?.id ?? ""}
      userName={session?.user?.name ?? ""}
      initialPredictions={predictions}
    />
  );
}
