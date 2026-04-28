import { createClient } from "@/lib/supabase-server";
import adminStyles from "../admin.module.css";
import styles from "./customers.module.css";

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
    ...c,
    order_count: c.orders?.length ?? 0,
    total_spent: (c.orders ?? []).filter((o: { status: string }) => o.status !== "cancelled").reduce((s: number, o: { total: number }) => s + o.total, 0),
    last_order: c.orders?.sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at ?? null,
  }));

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Customers</h1>
      <p className={adminStyles.pageSub}>{enriched.length} customer{enriched.length !== 1 ? "s" : ""} registered.</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
              <th>Since</th>
            </tr>
          </thead>
          <tbody>
            {enriched.length === 0 && (
              <tr><td colSpan={7} className={styles.empty}>No customers yet.</td></tr>
            )}
            {enriched.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td><a href={`tel:${c.phone}`} className={styles.phone}>{c.phone}</a></td>
                <td className={styles.addr}>{c.address}</td>
                <td className={styles.center}>{c.order_count}</td>
                <td className={styles.peso}>₱{c.total_spent}</td>
                <td className={styles.date}>{c.last_order ? new Date(c.last_order).toLocaleDateString("en-PH") : "—"}</td>
                <td className={styles.date}>{new Date(c.created_at).toLocaleDateString("en-PH")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
