import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const OWNER_EMAIL = "jc.floirendo01@gmail.com";

async function sendEmailAlert(order: {
  customer_name: string;
  customer_phone: string;
  items: { product_name: string; quantity: number }[];
  total: number;
  delivery_zone: string;
  payment_method: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const itemList = order.items.map((i) => `<li>${i.quantity}× ${i.product_name}</li>`).join("");
  const zone = order.delivery_zone === "gran_seville" ? "Gran Seville" : order.delivery_zone;
  const pay = order.payment_method === "gcash" ? "GCash" : "Cash";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Jada's Greens <onboarding@resend.dev>",
      to: OWNER_EMAIL,
      subject: `New Order — ${order.customer_name}`,
      html: `
        <h2>New Order on Jada's Greens 🌱</h2>
        <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_phone})</p>
        <p><strong>Items:</strong></p>
        <ul>${itemList}</ul>
        <p><strong>Total:</strong> ₱${order.total} [${pay}]</p>
        <p><strong>Zone:</strong> ${zone}</p>
      `,
    }),
  });
  if (!res.ok) console.error("Email send error:", res.status, await res.text());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, customer_phone, customer_address, delivery_zone, notes, items, total, payment_method } = body;

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
    payment_method: payment_method ?? "cash",
    notes: notes ?? null, items, total, status: "new",
  });

  if (error) {
    console.error("Order insert error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }

  // Fire email alert — non-blocking, failure won't break the order
  sendEmailAlert({ customer_name, customer_phone, items, total, delivery_zone: delivery_zone ?? "gran_seville", payment_method: payment_method ?? "cash" });

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
