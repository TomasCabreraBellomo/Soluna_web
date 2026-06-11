"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { adminNavigation } from "@/data/store";
import { getCurrentUser, logout, type MockUser } from "@/lib/auth";
import { canAccessModule, type AdminModule } from "@/lib/permissions";

function resolveModule(pathname: string): AdminModule {
  return (pathname.split("/")[2] || "dashboard") as AdminModule;
}

export function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<MockUser | null>(null);
  const [ready, setReady] = useState(false);
  const currentModule = useMemo(() => resolveModule(pathname), [pathname]);
  const allowed = user ? canAccessModule(user.role, currentModule) : false;

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/admin/login");
      return;
    }
    setUser(currentUser);
    setReady(true);
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  if (!ready || !user) {
    return <div className="min-h-screen bg-soluna-ivory" />;
  }

  const allowedNavigation = adminNavigation.filter(({ href }) => canAccessModule(user.role, href.split("/").pop() as AdminModule));

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-soluna-nude bg-white p-5 lg:block">
        <Link href="/" className="font-display text-4xl">
          Soluna
        </Link>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-soluna-champagne">Administracion</p>
        <nav className="mt-8 grid gap-2">
          {allowedNavigation.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                pathname.startsWith(href) ? "bg-soluna-nude/55 text-soluna-charcoal" : "text-soluna-charcoal hover:bg-soluna-nude/40"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-soluna-nude bg-white/90 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-soluna-champagne">Panel interno</p>
              <h1 className="font-display text-3xl">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-soluna-nude bg-soluna-ivory px-4 py-2 text-right text-sm">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-soluna-charcoal/55">Rol: {user.role}</p>
              </div>
              <button type="button" onClick={handleLogout} aria-label="Cerrar sesion" className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-soluna-nude bg-white">
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-5 pb-4 lg:hidden">
            {allowedNavigation.map(({ label, href }) => (
              <Link key={href} href={href} className="shrink-0 rounded-full border border-soluna-nude bg-white px-4 py-2 text-sm">
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-5 lg:p-8">
          {allowed ? (
            children
          ) : (
            <div className="rounded-lg border border-soluna-nude bg-white p-8 text-center shadow-soft">
              <h2 className="font-display text-3xl">No tenes permisos para acceder a esta seccion.</h2>
              <p className="mt-2 text-sm text-soluna-charcoal/60">Tu rol actual es {user.role}. Consulta con administracion para modificar permisos.</p>
              <Button href="/admin/dashboard" className="mt-5">Volver al dashboard</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
