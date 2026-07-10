import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, Menu, X, Moon, Sun } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FloatingChat } from "@/components/floating-chat";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/colleges", label: "College Explorer" },
  { to: "/rank-predictor", label: "Rank Predictor" },
  { to: "/choice-filling", label: "Choice Filling" },
  { to: "/counselling", label: "AI Counselling" },
  { to: "/cutoffs", label: "Cutoff Explorer" },
  { to: "/ai-chat", label: "AI Assistant" },
  { to: "/about", label: "About" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-elegant">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              TNEA<span className="text-primary italic">.ai</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    active ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Link to="/counselling" className="hidden sm:block">
              <Button size="sm" className="rounded-full shadow-elegant">Get Started</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border/60 bg-background">
            <div className="container-page py-3 grid gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border/60 bg-surface-muted">
        <div className="container-page py-12 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-4" />
              </div>
              <span className="text-base font-bold">TNEA<span className="text-primary italic">.ai</span></span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              An independent, data-driven assistant for Tamil Nadu Engineering Admissions. Not affiliated with the official DoTE Tamil Nadu portal.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/colleges" className="hover:text-primary">College Explorer</Link></li>
              <li><Link to="/rank-predictor" className="hover:text-primary">Rank Predictor</Link></li>
              <li><Link to="/cutoffs" className="hover:text-primary">Cutoff Explorer</Link></li>
              <li><Link to="/choice-filling" className="hover:text-primary">Choice Filling</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/ai-chat" className="hover:text-primary">AI Assistant</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="container-page py-4 text-xs text-muted-foreground flex flex-wrap gap-3 justify-between">
            <span>© {new Date().getFullYear()} TNEA.ai — Independent Admissions Intelligence.</span>
            <span>Data shown is illustrative until backend is connected.</span>
          </div>
        </div>
      </footer>

      <FloatingChat />
    </div>
  );
}
