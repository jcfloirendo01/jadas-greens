import { createClient } from "@/lib/supabase-server";
import type { Order } from "@/lib/types";
import OrdersClient from "./OrdersClient";
import adminStyles from "../admin.module.css";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Orders</h1>
      <p className={adminStyles.pageSub}>Manage and track all customer orders.</p>
      <OrdersClient initialOrders={(data ?? []) as Order[]} />
    </>
  );
}
