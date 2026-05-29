"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, BookOpen, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Início", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Meus Livros", href: "/meus-livros", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Configurações", href: "/configuracoes", icon: <Settings className="w-4 h-4" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Você");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email ?? "");
        setUserName(
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "Você"
        );
      }
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="w-56 flex-shrink-0 h-screen sticky top-0 bg-ink-900 flex flex-col border-r border-gold-500/10">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gold-500/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-base font-serif font-bold text-frost leading-tight tracking-wide">Escrita</span>
            <span className="text-[10px] tracking-[0.18em] uppercase text-gold-500 font-sans font-medium">BestSeller</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 scrollbar-thin">
        <ul className="space-y-0.5 px-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    active
                      ? "bg-gold-500/8 text-frost font-medium border-l-2 border-gold-500 pl-[10px]"
                      : "text-silver-400 hover:text-silver-200 hover:bg-ink-800/60 font-normal"
                  )}
                >
                  <span className={active ? "text-gold-500" : "text-silver-400/60"}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gold-500/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ink-700 border border-gold-500/20 flex items-center justify-center text-xs font-serif font-bold text-gold-400 shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-frost truncate">{userName}</p>
            <p className="text-[11px] text-silver-400/40 truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="text-silver-400/30 hover:text-red-400/70 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
