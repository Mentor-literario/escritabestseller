"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, BookOpen, Settings, BookHeart, LogOut } from "lucide-react";
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
        const name =
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "Você";
        setUserName(name);
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
    <aside className="w-58 flex-shrink-0 h-screen sticky top-0 bg-ink-900 flex flex-col overflow-hidden border-r border-purple-900/40">
      {/* Logo */}
      <div className="p-5 border-b border-purple-900/40">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center shadow-glow-purple">
            <BookHeart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-frost leading-tight">Escrita</p>
            <p className="text-xs text-purple-400">BestSeller</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <div className="px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-purple-700/30 text-frost border border-purple-700/50 shadow-glow-purple"
                        : "text-silver-400 hover:text-frost hover:bg-ink-700"
                    )}
                  >
                    <span className={active ? "text-purple-400" : "text-silver-400"}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-xs font-bold text-white shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-frost truncate">{userName}</p>
            <p className="text-xs text-silver-400/50 truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="text-silver-400/50 hover:text-red-400 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
