import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, History, Heart, Sparkles, Download } from "lucide-react";
import { COLLEGES, BRANCHES } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TNEA.ai" },
      { name: "description", content: "Your saved colleges, recent searches, favourite branches and AI recommendation history." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const saved = COLLEGES.slice(0, 4);
  const searches = ["CSE Chennai", "Government colleges Coimbatore", "PSG Tech placements", "Rank 1500 BC options"];
  const favBranches = BRANCHES.slice(0, 5);
  const recos = [
    { title: "AI Report · 15 Jun 2024", meta: "Rank 2500 · BC · Chennai preference" },
    { title: "AI Report · 12 Jun 2024", meta: "Rank 4800 · MBC · Coimbatore preference" },
  ];

  return (
    <AppShell>
      <section className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Dashboard</div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your workspace</h1>
        <p className="mt-3 text-muted-foreground">Everything you've saved, searched and generated in one place.</p>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <Card className="p-6 rounded-2xl lg:col-span-2">
            <div className="flex items-center gap-2 mb-4"><Bookmark className="size-5 text-primary" /><h2 className="font-bold">Saved Colleges</h2></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {saved.map((c) => (
                <Link key={c.code} to="/colleges/$code" params={{ code: c.code }}>
                  <Card className="p-4 rounded-xl hover:shadow-elegant hover:border-primary/30 transition-all">
                    <Badge variant="secondary" className="font-mono text-[10px]">Code {c.code}</Badge>
                    <div className="font-bold mt-2">{c.shortName}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.district}</div>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4"><History className="size-5 text-primary" /><h2 className="font-bold">Recent Searches</h2></div>
            <ul className="space-y-2">
              {searches.map((s) => <li key={s} className="text-sm py-2 border-b border-border last:border-0">{s}</li>)}
            </ul>
          </Card>

          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4"><Heart className="size-5 text-primary" /><h2 className="font-bold">Favourite Branches</h2></div>
            <div className="flex flex-wrap gap-2">{favBranches.map((b) => <Badge key={b} variant="secondary">{b}</Badge>)}</div>
          </Card>

          <Card className="p-6 rounded-2xl lg:col-span-2">
            <div className="flex items-center gap-2 mb-4"><Sparkles className="size-5 text-primary" /><h2 className="font-bold">Recommendation History</h2></div>
            <div className="space-y-3">
              {recos.map((r) => (
                <div key={r.title} className="p-4 border border-border rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-sm">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.meta}</div>
                  </div>
                  <button className="text-primary text-sm font-semibold inline-flex items-center gap-1"><Download className="size-3.5" /> Download</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
