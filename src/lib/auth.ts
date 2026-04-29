const KEY = "sipi.session";

export type Session = { user: string; name: string; email: string; ts: number };

export const auth = {
  login(user: string, pass: string): Session | null {
    if (user.trim().toLowerCase() === "admin" && pass === "admin123") {
      const s: Session = {
        user: "Admin",
        name: "Delegado Alves",
        email: "d.alves@policia.gov.br",
        ts: Date.now(),
      };
      sessionStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return null;
  },
  logout() { sessionStorage.removeItem(KEY); },
  get(): Session | null {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as Session; } catch { return null; }
  },
  isAuthed() { return !!auth.get(); },
};
