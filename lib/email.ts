import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Escrita BestSeller <noreply@autoralucrativa.shop>";
const BASE_URL = "https://app.autoralucrativa.shop";

export async function sendWelcomeEmail(to: string, name: string, password: string) {
  const firstName = name?.split(" ")[0] || "escritora";
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Seu acesso ao Escrita BestSeller chegou!",
    html: `
<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#fff">
  <p style="font-size:22px;font-weight:bold;color:#1a1a2e;margin:0 0 8px">Escrita BestSeller</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0 24px">
  <p style="color:#374151;margin:0 0 16px">Olá, ${firstName}!</p>
  <p style="color:#374151;margin:0 0 24px">Sua assinatura foi confirmada. Aqui estão seus dados de acesso:</p>
  <div style="background:#f5f3ff;border-radius:8px;padding:20px;margin:0 0 24px">
    <p style="margin:0 0 8px;color:#374151"><strong>E-mail:</strong> ${to}</p>
    <p style="margin:0;color:#374151"><strong>Senha:</strong> <code style="background:#ede9fe;padding:2px 8px;border-radius:4px;font-size:16px;letter-spacing:1px">${password}</code></p>
  </div>
  <a href="${BASE_URL}/login" style="display:inline-block;background:#7c3aed;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">Acessar a plataforma →</a>
  <p style="margin-top:24px;color:#6b7280;font-size:13px">Você pode trocar a senha a qualquer momento em Configurações.</p>
  <p style="color:#9ca3af;font-size:12px">Escrita BestSeller — ${BASE_URL}</p>
</div>`,
  });
}

export async function sendReactivationEmail(to: string, name: string) {
  const firstName = name?.split(" ")[0] || "escritora";
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Sua assinatura no Escrita BestSeller foi reativada",
    html: `
<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#fff">
  <p style="font-size:22px;font-weight:bold;color:#1a1a2e;margin:0 0 8px">Escrita BestSeller</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0 24px">
  <p style="color:#374151;margin:0 0 16px">Olá, ${firstName}!</p>
  <p style="color:#374151;margin:0 0 24px">Sua assinatura foi reativada com sucesso. Acesse com seu e-mail e senha normalmente.</p>
  <a href="${BASE_URL}/login" style="display:inline-block;background:#7c3aed;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">Acessar a plataforma →</a>
  <p style="margin-top:24px;color:#6b7280;font-size:13px">Esqueceu a senha? Use "Esqueci minha senha" na página de login.</p>
  <p style="color:#9ca3af;font-size:12px">Escrita BestSeller — ${BASE_URL}</p>
</div>`,
  });
}
