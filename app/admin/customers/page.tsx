import { createClient } from "@/lib/supabase-server";
import adminStyles from "../admin.module.css";
import CustomersClient from "./CustomersClient";

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("*, orders(id, total, status, created_at)")
    .order("created_at", { ascending: false });

  const enriched = (customers ?? []).map((c: {
    id: string; name: string; phone: string; address: string; created_at: string;
    orders: Array<{ id: string; total: number; status: string; created_at: string }>;
  }) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    address: c.address,
    created_at: c.created_at,
    order_count: c.orders?.length ?? 0,
    total_spent: (c.orders ?? []).filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    last_order: c.orders?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at ?? null,
  }));

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Customers</h1>
      <CustomersClient customers={enriched} />
    </>
  );
}
