import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendWelcomeEmail, sendReactivationEmail } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generatePassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const base = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return base + "A1!";
}

function validateSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!secret) return false;

  const signature = req.nextUrl.searchParams.get("signature");
  if (!signature) return false;

  const computed = crypto.createHmac("sha1", secret).update(rawBody).digest("hex");
  return computed === signature;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const body = JSON.parse(rawBody) as Record<string, unknown>;

  if (!validateSignature(req, rawBody)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status: string = body.order_status as string;
  const email: string = (body.Customer as Record<string, string>)?.email;
  const name: string = (body.Customer as Record<string, string>)?.full_name ?? "";
  const subscriptionId: string = (body.subscription_id as string) ?? (body.order_id as string);
  const planName: string = (body.product_title as string) ?? "Pro";

  if (!email) {
    return NextResponse.json({ error: "No email" }, { status: 400 });
  }

  if (status === "paid") {
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    if (existing) {
      await supabaseAdmin.from("profiles").update({
        plan: planName,
        plan_status: "active",
        kiwify_subscription_id: subscriptionId,
        plan_expires_at: null,
      }).eq("id", existing.id);

      await sendReactivationEmail(email, name || (existing.user_metadata?.name as string) || "");
    } else {
      const tempPassword = generatePassword();
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name },
      });

      if (error || !created?.user) {
        console.error("Erro ao criar usuária:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }

      await supabaseAdmin.from("profiles").update({
        name,
        plan: planName,
        plan_status: "active",
        kiwify_subscription_id: subscriptionId,
        plan_expires_at: null,
      }).eq("id", created.user.id);

      await sendWelcomeEmail(email, name, tempPassword);
    }

    return NextResponse.json({ ok: true });
  }

  if (status === "refunded" || status === "chargedback") {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users?.users?.find((u) => u.email === email);
    if (user) {
      await supabaseAdmin.from("profiles").update({
        plan_status: "inactive",
        plan_expires_at: new Date().toISOString(),
      }).eq("id", user.id);
    }
    return NextResponse.json({ ok: true });
  }

  if (status === "subscription_canceled") {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users?.users?.find((u) => u.email === email);
    if (user) {
      await supabaseAdmin.from("profiles").update({
        plan_status: "canceled",
        plan_expires_at: new Date().toISOString(),
      }).eq("id", user.id);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
