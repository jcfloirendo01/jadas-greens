import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const DEFAULT_ORDER_EMAIL = "jc.floirendo01@gmail.com";
const DEFAULT_FROM_EMAIL = "Jada's Greens <onboarding@resend.dev>";

function getOrderEmailRecipients() {
  return (process.env.RESEND_ORDER_TO_EMAILS ?? DEFAULT_ORDER_EMAIL)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function getOrderEmailSender() {
  return process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

function getGmailCredentials() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");

  if (!user || !pass) return null;
  return { user, pass };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmailAlert(order: {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes?: string | null;
  items: { product_name: string; quantity: number; unit_price?: number; subtotal?: number }[];
  total: number;
  delivery_zone: string;
  payment_method: string;
}) {
  const recipients = getOrderEmailRecipients();

  if (recipients.length === 0) return;

  const itemRows = order.items
    .map((item) => {
      const lineTotal = item.subtotal ?? (item.unit_price ? item.unit_price * item.quantity : undefined);

      return `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #e4ecd8;">
            <div style="font-weight: 700; color: #24351f; font-size: 15px;">${escapeHtml(item.product_name)}</div>
            <div style="color: #6b7b63; font-size: 13px; margin-top: 3px;">Fresh harvest item</div>
          </td>
          <td align="center" style="padding: 14px 10px; border-bottom: 1px solid #e4ecd8; color: #24351f; font-size: 15px; font-weight: 700;">
            ${item.quantity}x
          </td>
          <td align="right" style="padding: 14px 0; border-bottom: 1px solid #e4ecd8; color: #24351f; font-size: 15px; font-weight: 700;">
            ${lineTotal === undefined ? "" : `PHP ${lineTotal}`}
          </td>
        </tr>
      `;
    })
    .join("");

  const itemText = order.items.map((item) => `- ${item.quantity}x ${item.product_name}`).join("\n");
  const zone = order.delivery_zone === "gran_seville" ? "Gran Seville" : order.delivery_zone;
  const pay = order.payment_method === "gcash" ? "GCash" : "Cash";
  const subject = `New Order - ${order.customer_name}`;
  const notes = order.notes?.trim();
  const text = [
    "New Order on Jada's Greens",
    "",
    `Customer: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Address: ${order.customer_address}`,
    `Zone: ${zone}`,
    `Payment: ${pay}`,
    "",
    "Items:",
    itemText,
    "",
    `Total: PHP ${order.total}`,
    notes ? `Notes: ${notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const html = `
    <!doctype html>
    <html>
      <body style="margin: 0; padding: 0; background: #f4f7ef; font-family: Arial, Helvetica, sans-serif; color: #24351f;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f4f7ef; padding: 28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #dfe8d4;">
                <tr>
                  <td style="background: #2f5d34; padding: 28px 30px;">
                    <div style="color: #d9f0cb; font-size: 13px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase;">Jada's Greens</div>
                    <h1 style="margin: 8px 0 0; color: #ffffff; font-size: 28px; line-height: 1.2; font-weight: 800;">New order received</h1>
                    <p style="margin: 10px 0 0; color: #edf8e6; font-size: 15px; line-height: 1.6;">A customer submitted an Olmetie order. Details are ready for confirmation.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 26px 30px 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background: #f6faef; border: 1px solid #dfe8d4; border-radius: 14px; padding: 18px;">
                          <div style="color: #6b7b63; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Customer</div>
                          <div style="margin-top: 8px; color: #24351f; font-size: 21px; font-weight: 800;">${escapeHtml(order.customer_name)}</div>
                          <div style="margin-top: 6px; color: #3f5439; font-size: 15px;">${escapeHtml(order.customer_phone)}</div>
                          <div style="margin-top: 10px; color: #52664b; font-size: 14px; line-height: 1.5;">${escapeHtml(order.customer_address)}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 30px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="50%" style="padding-right: 6px;">
                          <div style="background: #fffaf1; border: 1px solid #efe0bd; border-radius: 14px; padding: 16px;">
                            <div style="color: #8a6a26; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Payment</div>
                            <div style="margin-top: 7px; color: #2d3326; font-size: 18px; font-weight: 800;">${pay}</div>
                          </div>
                        </td>
                        <td width="50%" style="padding-left: 6px;">
                          <div style="background: #f3f8ff; border: 1px solid #d7e5f4; border-radius: 14px; padding: 16px;">
                            <div style="color: #4f6d8b; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Delivery zone</div>
                            <div style="margin-top: 7px; color: #2d3326; font-size: 18px; font-weight: 800;">${escapeHtml(zone)}</div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 30px 0;">
                    <h2 style="margin: 0 0 10px; color: #24351f; font-size: 18px; line-height: 1.3;">Order Summary</h2>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                      <tr>
                        <th align="left" style="padding: 0 0 8px; color: #7b8a73; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                        <th align="center" style="padding: 0 10px 8px; color: #7b8a73; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                        <th align="right" style="padding: 0 0 8px; color: #7b8a73; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Amount</th>
                      </tr>
                      ${itemRows}
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 18px 30px 26px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #2f5d34; border-radius: 14px;">
                      <tr>
                        <td style="padding: 18px 20px; color: #d9f0cb; font-size: 14px; font-weight: 700;">Total</td>
                        <td align="right" style="padding: 18px 20px; color: #ffffff; font-size: 26px; font-weight: 900;">PHP ${order.total}</td>
                      </tr>
                    </table>
                    ${
                      notes
                        ? `<div style="margin-top: 16px; background: #f7f1e6; border: 1px solid #ead9bc; border-radius: 14px; padding: 16px;">
                            <div style="color: #8a6a26; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Customer notes</div>
                            <div style="margin-top: 8px; color: #4b432f; font-size: 14px; line-height: 1.6;">${escapeHtml(notes)}</div>
                          </div>`
                        : ""
                    }
                  </td>
                </tr>

                <tr>
                  <td style="padding: 18px 30px; background: #edf4e7; color: #6b7b63; font-size: 12px; line-height: 1.6; text-align: center;">
                    This notification was sent automatically from Jada's Greens order form.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const gmail = getGmailCredentials();
  if (gmail) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: gmail,
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM?.trim() || gmail.user,
      to: recipients,
      subject,
      text,
      html,
    });
    console.log("Order email sent:", info.accepted);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: getOrderEmailSender(),
      to: recipients,
      subject,
      text,
      html,
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
    customer_id,
    customer_name,
    customer_phone,
    customer_address,
    delivery_zone: delivery_zone ?? "gran_seville",
    payment_method: payment_method ?? "cash",
    notes: notes ?? null,
    items,
    total,
    status: "new",
  });

  if (error) {
    console.error("Order insert error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }

  try {
    await sendEmailAlert({
      customer_name,
      customer_phone,
      customer_address,
      notes,
      items,
      total,
      delivery_zone: delivery_zone ?? "gran_seville",
      payment_method: payment_method ?? "cash",
    });
  } catch (error) {
    console.error("Email send error:", error);
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
