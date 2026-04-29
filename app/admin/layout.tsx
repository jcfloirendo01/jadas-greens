import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";
import type { Order } from "@/lib/types";

export const metadata = { title: "Admin — Jada's Greens CRM" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: newOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "new")
    .order("created_at", { ascending: false });

  return (
    <AdminShell email={user.email} initialNewOrders={(newOrders ?? []) as Order[]}>
      {children}
    </AdminShell>
  );
}
