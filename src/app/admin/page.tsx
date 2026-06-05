import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return <AdminDashboard username={String(session.username)} />;
}
