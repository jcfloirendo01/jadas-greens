import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, customer_phone, customer_address, delivery_zone, notes, items, total } = body;

  if (!customer_name || !customer_phone || !customer_address || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();

  // Upsert customer by phone
  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", customer_phone)
    .maybeSingle();

  let customer_id: string | null = existing?.id ?? null;
  if (!customer_id) {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({ name: customer_name, phone: customer_phone, address: customer_address })
      .select("id")
      .single();
    customer_id = newCustomer?.id ?? null;
  }

  const { error } = await supabase.from("orders").insert({
    customer_id, customer_name, customer_phone, customer_address,
    delivery_zone: delivery_zone ?? "gran_seville",
    notes: notes ?? null, items, total, status: "new",
  });

  if (error) {
    console.error("Order insert error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
