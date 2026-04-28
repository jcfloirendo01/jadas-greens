import { createClient } from "@/lib/supabase-server";
import type { Product } from "@/lib/types";
import ProductsClient from "./ProductsClient";
import adminStyles from "../admin.module.css";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").order("created_at");
  return (
    <>
      <h1 className={adminStyles.pageTitle}>Products</h1>
      <p className={adminStyles.pageSub}>Manage lettuce variety availability and pricing.</p>
      <ProductsClient initialProducts={(data ?? []) as Product[]} />
    </>
  );
}
