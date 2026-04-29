import { createClient } from "@/lib/supabase-server";
import type { Expense } from "@/lib/types";
import ExpensesClient from "./ExpensesClient";
import adminStyles from "../admin.module.css";

export default async function ExpensesPage() {
  const supabase = await createClient();

  const [{ data: expenses }, { data: orders }] = await Promise.all([
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
    supabase.from("orders").select("total, status"),
  ]);

  const totalRevenue = (orders ?? [])
    .filter((o: { status: string }) => o.status !== "cancelled")
    .reduce((s: number, o: { total: number }) => s + o.total, 0);

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Expenses</h1>
      <p className={adminStyles.pageSub}>Track farm costs — nutrients, cups, soil, tools, and more.</p>
      <ExpensesClient initialExpenses={(expenses ?? []) as Expense[]} totalRevenue={totalRevenue} />
    </>
  );
}
