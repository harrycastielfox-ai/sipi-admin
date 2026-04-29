import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User as UserIcon, AlertCircle, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const nav = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    setTimeout(() => {
      const s = auth.login(user, pass);
      setLoading(false);
      if (s) nav("/modulos");
      else setErr("Credenciais inválidas. Verifique usuário e senha.");
    }, 350);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_55%)]" />
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 p-4 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.6)]">
            <Shield className="h-10 w-10 text-primary" strokeWidth={2.2} />
          </div>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.32em] text-primary">Acesso Restrito</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">SIPI</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sistema de Inquéritos Policiais</p>
          <p className="mt-3 text-xs text-muted-foreground/80">DT Itabela — 23ª COORPIN</p>
        </div>

        <form onSubmit={submit} className="panel space-y-5 p-7">
          <div className="space-y-2">
            <Label htmlFor="user" className="label-eyebrow">Usuário</Label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="user" autoFocus value={user} onChange={e => setUser(e.target.value)}
                className="h-11 pl-10" placeholder="Digite seu usuário" autoComplete="username" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pass" className="label-eyebrow">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pass" type="password" value={pass} onChange={e => setPass(e.target.value)}
                className="h-11 pl-10" placeholder="••••••••" autoComplete="current-password" />
            </div>
          </div>

          {err && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive animate-fade-in">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{err}</span>
            </div>
          )}

          <Button type="submit" disabled={loading}
            className="h-11 w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-[var(--shadow-elegant)]">
            {loading ? "Validando..." : (<><span>ENTRAR</span><ArrowRight className="ml-2 h-4 w-4" /></>)}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground/70">
            Protótipo — usuário <span className="font-mono text-primary/80">Admin</span> · senha <span className="font-mono text-primary/80">admin123</span>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Polícia Civil — Uso restrito a agentes autorizados
        </p>
      </div>
    </main>
  );
}
