import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET() {
  const result = await sendWelcomeEmail(
    "graziela_andrade@hotmail.com",
    "Graziela Andrade",
    "teste123A1!"
  );

  return NextResponse.json(result);
}
