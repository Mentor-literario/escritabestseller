import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email: string };

    if (!email?.trim()) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email.trim(),
      options: {
        redirectTo: "https://app.autoralucrativa.shop/reset-senha",
      },
    });

    if (error || !data?.properties?.hashed_token) {
      return NextResponse.json({ ok: true });
    }

    const resetLink = `https://app.autoralucrativa.shop/auth/callback?token_hash=${data.properties.hashed_token}&type=recovery&next=/reset-senha`;

    await sendPasswordResetEmail(email.trim(), resetLink);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
