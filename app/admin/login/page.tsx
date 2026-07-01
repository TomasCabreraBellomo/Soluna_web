"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getCurrentUser, login } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getCurrentUser()) router.replace("/admin/dashboard");
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Completa email y contrasena para ingresar.");
      return;
    }

    setLoading(true);
    const user = login(email, password);
    if (!user) {
      setError("Credenciales invalidas. Revisa el email y la contrasena.");
      setLoading(false);
      return;
    }
    router.replace("/admin/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#FAF8F5_0%,#E8D9D7_58%,#FFFFFF_100%)] px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-soluna-nude bg-white/92 p-8 shadow-glow backdrop-blur">
        <p className="text-center font-display text-5xl">Soluna</p>
        <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.22em] text-soluna-champagne">Acceso interno</p>
        <p className="mt-3 text-center text-sm leading-6 text-soluna-charcoal/65">Ingresa tus credenciales para gestionar productos, ventas y stock.</p>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="focus-ring h-12 rounded-lg border border-soluna-nude bg-soluna-ivory/60 px-4 font-normal"
              autoComplete="email"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Contrasena
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus-ring h-12 rounded-lg border border-soluna-nude bg-soluna-ivory/60 px-4 font-normal"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="rounded-lg bg-soluna-nude/45 px-4 py-3 text-sm text-[#8b4b4b]">{error}</p> : null}
          <button type="submit" disabled={loading} className="focus-ring mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-soluna-champagne px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-[#b79558] disabled:cursor-not-allowed disabled:opacity-65">
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>
        <div className="mt-6 rounded-lg bg-soluna-ivory p-4 text-xs leading-6 text-soluna-charcoal/65">
          <p>admin@soluna.com / admin123</p>
          <p>ventas@soluna.com / ventas123</p>
          <p>stock@soluna.com / stock123</p>
        </div>
      </section>
    </main>
  );
}
