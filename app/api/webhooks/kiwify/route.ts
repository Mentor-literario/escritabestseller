import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function validateToken(body: Record<string, unknown>): boolean {
  const expected = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!expected) return false;
  return body.token === expected;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!validateToken(body)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status: string = body.order_status as string;
  const email: string = (body.Customer as Record<string, string>)?.email;
  const name: string = (body.Customer as Record<string, string>)?.full_name ?? "";
  const subscriptionId: string = body.subscription_id as string ?? body.order_id as string;
  const planName: string = body.product_title as string ?? "Pro";

  if (!email) {
    return NextResponse.json({ error: "No email" }, { status: 400 });
  }

  if (status === "paid") {
    // Cria ou recupera o usuário
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    if (existing) {
      // Usuária já existe — reativa o plano
      await supabaseAdmin.from("profiles").update({
        plan: planName,
        plan_status: "active",
        kiwify_subscription_id: subscriptionId,
        plan_expires_at: null,
      }).eq("id", existing.id);
    } else {
      // Cria nova usuária
      const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
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

      // Envia e-mail de redefinição de senha (a usuária define a própria senha)
      await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: {
          redirectTo: "https://app.autoralucrativa.shop/login",
        },
      });
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
