import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escrita BestSeller",
  description: "Transforme sua ideia em um livro publicado, estratégico e pronto para encontrar leitores.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
