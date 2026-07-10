import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { STATS, COLLEGES } from "@/lib/mock-data";
import {
  Sparkles, GraduationCap, TrendingUp, ListChecks, LineChart,
  Compass, ArrowRight, ShieldCheck, Database, BadgeCheck, MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TNEA.ai — AI-Powered Tamil Nadu Engineering Admissions Assistant" },
      { name: "description", content: "Personalized college and branch recommendations for TNEA. Explore colleges, predict rank, analyse cutoffs and file smarter choices." },
    ],
  }),
  component: Home,
});

const FEATURES = [
  { icon: Compass, title: "College Explorer", desc: "Filter 460+ colleges by district, NAAC grade, fees, placement and branch.", to: "/colleges" as const },
  { icon: TrendingUp, title: "Rank Predictor", desc: "Estimate general and community rank instantly from your TNEA cutoff.", to: "/rank-predictor" as const },
  { icon: Sparkles, title: "AI Counselling", desc: "Dream, target and safe college lists tailored to your rank and preferences.", to: "/counselling" as const },
  { icon: ListChecks, title: "Choice Filling", desc: "Drag-and-drop preference list with AI-driven order suggestions.", to: "/choice-filling" as const },
  { icon: LineChart, title: "Cutoff Explorer", desc: "Interactive cutoff history charts across colleges, branches and communities.", to: "/cutoffs" as const },
  { icon: MessageSquare, title: "AI Assistant", desc: "Ask anything about counselling rules, seat matrix, hostels or placements.", to: "/ai-chat" as const },
];

function Home() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container-page pt-16 pb-20 md:pt-24 md:pb-28 text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Updated for the 2024 counselling window
          </div>
          <h1 className="mt-6 mx-auto max-w-4xl text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            AI-Powered <span className="text-primary">TNEA</span> Counselling Assistant
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
            Get personalized college and branch recommendations using verified TNEA data and AI analysis — so you file the right choices with confidence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/counselling">
              <Button size="lg" className="rounded-xl shadow-glow px-6 h-12 gap-2">
                <Sparkles className="size-4" /> Start Counselling
              </Button>
            </Link>
            <Link to="/colleges">
              <Button size="lg" variant="outline" className="rounded-xl h-12 px-6">
                Explore Colleges
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="container-page pb-16 md:pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Colleges", value: `${STATS.colleges}+`, icon: GraduationCap },
              { label: "Branches", value: `${STATS.branches}+`, icon: BadgeCheck },
              { label: "Years of Cutoffs", value: `${STATS.cutoffYears}`, icon: Database },
              { label: "AI Recommendations", value: `${(STATS.aiRecommendations / 1000).toFixed(0)}k+`, icon: Sparkles },
            ].map((s) => (
              <Card key={s.label} className="p-6 rounded-2xl border-border/60 hover:shadow-elegant transition-shadow">
                <s.icon className="size-5 text-primary mb-3" />
                <div className="text-3xl font-extrabold tracking-tight">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-medium">{s.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-y border-border/60 bg-surface-muted/40">
        <div className="container-page py-20">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Toolset</div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Everything you need in one place</h2>
            <p className="mt-3 text-muted-foreground">Purpose-built modules for every stage of the TNEA journey — from exploration to final choice submission.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Link key={f.title} to={f.to} className="group">
                <Card className="p-6 rounded-2xl h-full border-border/60 hover:border-primary/30 hover:shadow-elegant transition-all">
                  <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary mb-5">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  <div className="mt-5 text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open <ArrowRight className="size-3.5" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured colleges */}
      <section className="container-page py-20">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Featured</div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Top-tier institutions</h2>
          </div>
          <Link to="/colleges" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
            View all colleges <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {COLLEGES.slice(0, 6).map((c) => (
            <Link key={c.code} to="/colleges/$code" params={{ code: c.code }} className="group">
              <Card className="p-6 rounded-2xl h-full border-border/60 hover:border-primary/30 hover:shadow-elegant transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wide font-mono">Code {c.code}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-wide">
                    <span className="size-2 rounded-full bg-success" /> NAAC {c.naac}
                  </span>
                </div>
                <h3 className="text-base font-bold group-hover:text-primary transition-colors leading-tight">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{c.district}, Tamil Nadu</p>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Placement</div>
                    <div className="text-sm font-bold">{c.placementPercentage}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Avg Package</div>
                    <div className="text-sm font-bold">₹{c.averagePackage} LPA</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-16 grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Verified data", desc: "Cutoffs sourced from official TNEA seat allotment records." },
            { icon: Sparkles, title: "AI recommendations", desc: "Trained on 10 years of counselling patterns and preferences." },
            { icon: MessageSquare, title: "Always-on assistant", desc: "Ask anything about rules, seats, fees — get answers in seconds." },
          ].map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/10">
                <f.icon className="size-5" />
              </div>
              <div>
                <div className="font-bold">{f.title}</div>
                <div className="text-sm opacity-80 mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
