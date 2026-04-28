import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Sidebar from "@/components/admin/Sidebar";
import styles from "./admin.module.css";

export const metadata = { title: "Admin — Jada's Greens CRM" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
